;(function () {
'use strict'
/* global define */

var esprima
var exportFn
var toString = Object.prototype.toString
var hasOwn = Object.prototype.hasOwnProperty

if (typeof module === 'object' && typeof module.exports === 'object' && typeof require === 'function') {
  esprima = require('esprima')
  exportFn = function (redeyed) { module.exports = redeyed }
  bootstrap(esprima, exportFn)
} else if (typeof define === 'function' && define.amd) {
  define(['esprima'], function (esprima) {
    return bootstrap(esprima)
  })
} else if (typeof window === 'object') {
  window.redeyed = bootstrap(window.esprima)
}

function bootstrap (esprima, exportFn) {
  function isFunction (obj) {
    return toString.call(obj) === '[object Function]'
  }

  function isString (obj) {
    return toString.call(obj) === '[object String]'
  }

  function isObject (obj) {
    return toString.call(obj) === '[object Object]'
  }

  function owns (obj, key) {
    return hasOwn.call(obj, key)
  }

  function surroundWith (before, after) {
    return function (s) { return before + s + after }
  }

  function isNonCircular (key) {
    return key !== '_parent'
  }

  function objectizeString (value) {
    var vals = value.split(':')

    if (vals.length === 0 || vals.length > 2) {
      throw new Error(
        'illegal string config: ' + value +
        '\nShould be of format "before:after"'
      )
    }

    if (vals.length === 1 || vals[1].length === 0) {
      return vals.indexOf(':') < 0 ? { _before: vals[0] } : { _after: vals[0] }
    }
    return { _before: vals[0], _after: vals[1] }
  }

  function cloneConfig (value, ancestors) {
    if (!isObject(value)) return value
    if (ancestors.indexOf(value) !== -1) {
      throw new TypeError('redeyed config must not contain circular references')
    }

    var clone = Object.create(null)
    var nextAncestors = ancestors.concat([value])
    Object.keys(value).forEach(function (key) {
      clone[key] = cloneConfig(value[key], nextAncestors)
    })
    return clone
  }

  function objectize (node, parent) {
    function resolve (key) {
      if (node._default && node._default[key]) return node._default[key]
      if (!parent) return undefined
      return parent._default ? parent._default[key] : undefined
    }

    function process (key) {
      var value = node[key]

      if (!value) return
      if (isFunction(value)) return

      if (isString(value)) {
        node[key] = value = objectizeString(value)
      }

      if (isObject(value)) {
        if (!value._before && !value._after) {
          objectize(value, node)
          return
        }

        value._before = value._before || resolve('_before')
        value._after = value._after || resolve('_after')
        return
      }

      throw new Error('nodes need to be either {String}, {Object} or {Function}.' + value + ' is neither.')
    }

    if (node._default) process('_default')

    Object.keys(node)
      .filter(function (key) {
        return isNonCircular(key) &&
          owns(node, key) &&
          key !== '_before' &&
          key !== '_after' &&
          key !== '_default'
      })
      .forEach(process)
  }

  function functionize (node) {
    Object.keys(node)
      .filter(function (key) {
        return isNonCircular(key) && owns(node, key)
      })
      .forEach(function (key) {
        var value = node[key]

        if (isFunction(value)) return

        if (isObject(value)) {
          if (!value._before && !value._after) {
            functionize(value)
            return
          }

          var before = value._before || ''
          var after = value._after || ''
          node[key] = surroundWith(before, after)
        }
      })
  }

  function normalize (root) {
    if (!isObject(root)) {
      throw new TypeError('redeyed config must be an object')
    }
    var normalized = cloneConfig(root, [])
    objectize(normalized)
    functionize(normalized)
    return normalized
  }

  function mergeOptions (custom, required) {
    var options = {}
    if (custom && isObject(custom)) {
      Object.keys(custom).forEach(function (key) {
        Object.defineProperty(options, key, {
          configurable: true,
          enumerable: true,
          value: custom[key],
          writable: true
        })
      })
    }
    Object.keys(required).forEach(function (key) {
      options[key] = required[key]
    })
    return options
  }

  function addParserToken (token, tokens, comments) {
    if (token.type === 'LineComment') {
      token.type = 'Line'
      comments.push(token)
    } else if (token.type === 'BlockComment') {
      token.type = 'Block'
      comments.push(token)
    } else if (token.type === 'Line' || token.type === 'Block') {
      comments.push(token)
    } else {
      if (token.type === 'Identifier' && token.value === 'static') token.type = 'Keyword'
      tokens.push(token)
    }
  }

  function tokenize (parser, code, parserOptions) {
    var tokens = []
    var comments = []
    var delegated = false
    var options = mergeOptions(parserOptions, {
      range: true,
      loc: true,
      comment: true
    })
    var result = parser.tokenize(code, options, function (token) {
      delegated = true
      addParserToken(token, tokens, comments)
    })

    if (!delegated) {
      var returnedTokens = Array.isArray(result) ? result : result && result.tokens
      var returnedComments = !Array.isArray(result) && result && result.comments
      if (Array.isArray(returnedTokens)) {
        returnedTokens.forEach(function (token) {
          addParserToken(token, tokens, comments)
        })
      }
      if (Array.isArray(returnedComments)) {
        returnedComments.forEach(function (comment) {
          addParserToken(comment, tokens, comments)
        })
      }
    }

    return { tokens: tokens, comments: comments }
  }

  function mergeTokensAndComments (tokens, comments) {
    var all = Object.create(null)

    function addToAllByRangeStart (token) {
      all[String(token.range[0])] = token
    }

    tokens.forEach(addToAllByRangeStart)
    comments.forEach(addToAllByRangeStart)

    return Object.keys(all)
      .sort(function (a, b) { return Number(a) - Number(b) })
      .map(function (key) { return all[key] })
  }

  function maskHashbang (code) {
    if (code[0] !== '#' || code[1] !== '!') {
      return { code: code, hashbang: '' }
    }

    var newline = code.indexOf('\n')
    var end = newline === -1 ? code.length : newline + 1
    var hashbang = code.slice(0, end)
    var replacement = newline === -1
      ? ' '.repeat(end)
      : ' '.repeat(end - 1) + '\n'

    return {
      code: replacement + code.slice(end),
      hashbang: hashbang
    }
  }

  function redeyed (code, config, opts) {
    opts = opts || {}
    var parser = opts.parser || esprima
    var jsx = !!opts.jsx
    var buildAst = jsx || !!opts.buildAst
    var masked = maskHashbang(code)
    var hashbang = masked.hashbang
    var ast
    var tokens
    var comments
    var lastSplitEnd = 0
    var splits = []
    var transformedCode
    var all
    var info

    code = masked.code

    if (buildAst) {
      var parseOptions = mergeOptions(opts.parserOptions, {
        tokens: true,
        comment: true,
        range: true,
        loc: true,
        tolerant: true,
        jsx: true
      })
      ast = parser.parse(code, parseOptions)
      tokens = ast.tokens || []
      comments = ast.comments || []
    } else {
      var tokenized = tokenize(parser, code, opts.parserOptions)
      tokens = tokenized.tokens
      comments = tokenized.comments
    }
    config = normalize(config)

    function tokenIndex (tokenList, token, start) {
      var current
      var rangeStart = token.range[0]

      for (current = start; current < tokenList.length; current++) {
        if (tokenList[current].range[0] === rangeStart) return current
      }

      throw new Error('Token %s not found at or after index: %d', token, start)
    }

    function process (surround, start, end, currentInfo) {
      var result
      var currentIndex
      var nextIndex
      var skip = 0
      var splitEnd

      result = surround(code.slice(start, end), currentInfo)
      if (isObject(result)) {
        splits.push(result.replacement)

        currentIndex = currentInfo.tokenIndex
        nextIndex = tokenIndex(currentInfo.tokens, result.skipPastToken, currentIndex)
        skip = nextIndex - currentIndex
        splitEnd = skip > 0 ? tokens[nextIndex - 1].range[1] : end
      } else {
        splits.push(result)
        splitEnd = end
      }

      return { skip: skip, splitEnd: splitEnd }
    }

    function addSplit (start, end, surround, currentInfo) {
      var result
      var skip = 0

      if (start >= end) return
      if (surround) {
        result = process(surround, start, end, currentInfo)
        skip = result.skip
        lastSplitEnd = result.splitEnd
      } else {
        splits.push(code.slice(start, end))
        lastSplitEnd = end
      }

      return skip
    }

    all = mergeTokensAndComments(tokens, comments)
    for (var tokenIdx = 0; tokenIdx < all.length; tokenIdx++) {
      var token = all[tokenIdx]
      var surroundForType = config[token.type]
      var surround
      var start
      var end

      if (surroundForType) {
        surround = owns(surroundForType, token.value) &&
          surroundForType[token.value] &&
          isFunction(surroundForType[token.value])
          ? surroundForType[token.value]
          : surroundForType._default

        start = token.range[0]
        end = token.range[1]

        addSplit(lastSplitEnd, start)
        info = { tokenIndex: tokenIdx, tokens: all, ast: ast, code: code }
        tokenIdx += addSplit(start, end, surround, info)
      }
    }

    if (lastSplitEnd < code.length) {
      addSplit(lastSplitEnd, code.length)
    }

    if (!opts.nojoin) {
      transformedCode = splits.join('')
      if (hashbang.length > 0) {
        transformedCode = hashbang + transformedCode.substr(hashbang.length)
      }
    }

    return {
      ast: ast,
      tokens: tokens,
      comments: comments,
      splits: splits,
      code: transformedCode
    }
  }

  return exportFn ? exportFn(redeyed) : redeyed
}
})()
