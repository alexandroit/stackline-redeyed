'use strict'

var assert = require('node:assert/strict')
var baseline = require('redeyed-baseline')
var redeyed = require('../redeyed.js')

var sources = [
  '',
  'var value = 1;',
  'const value = true;',
  'if (value) return null;',
  'function add(a, b) { return a + b; }',
  'class Box { constructor(value) { this.value = value } }',
  'const arrow = (value) => value * 2;',
  '/* block */ var value = "text"; // line',
  'x={y,...z}',
  'value **= 2',
  'async function read() { return await source }',
  'for (var i = 0; i < 3; i++) value += i',
  '#!/usr/bin/env node\nvar value = 1;',
  'if (value) { partial',
  'const incomplete = '
]

for (var generated = 0; generated < 40; generated++) {
  sources.push(
    'var item' + generated + ' = ' + generated + '; // generated ' + generated
  )
}

var configFactories = [
  function () { return {} },
  function () { return { Keyword: { _default: '<:>' } } },
  function () { return { Identifier: { _default: '[:]' } } },
  function () { return { Numeric: { _default: '{:}' } } },
  function () { return { String: { _default: '/:/' } } },
  function () { return { Line: { _default: '(:)' }, Block: { _default: '(:)' } } },
  function () {
    return {
      Keyword: {
        var: '^:',
        return: ':$',
        _default: '<:>'
      }
    }
  },
  function () {
    return {
      Keyword: {
        _default: { _before: '<', _after: '>' }
      },
      _default: { _before: '[', _after: ']' }
    }
  },
  function () {
    return {
      Identifier: {
        _default: function (source) { return source.toUpperCase() }
      }
    }
  },
  function () {
    return {
      Punctuator: {
        _default: function (source) { return '(' + source + ')' }
      }
    }
  }
]

function simplifyToken (token) {
  return {
    type: token.type,
    value: token.value,
    range: token.range,
    loc: token.loc
  }
}

function simplifyResult (result) {
  return {
    ast: result.ast ? JSON.parse(JSON.stringify(result.ast)) : result.ast,
    code: result.code,
    comments: result.comments.map(simplifyToken),
    splits: result.splits,
    tokens: result.tokens.map(simplifyToken)
  }
}

function outcome (implementation, source, config, options) {
  try {
    return {
      threw: false,
      value: simplifyResult(implementation(source, config, options))
    }
  } catch (error) {
    return {
      threw: true,
      name: error.name,
      message: error.message
    }
  }
}

var comparisons = 0
sources.forEach(function (source, sourceIndex) {
  configFactories.forEach(function (configFactory, configIndex) {
    ;[{}, { nojoin: true }].forEach(function (options, optionIndex) {
      var expected = outcome(baseline, source, configFactory(), options)
      var actual = outcome(redeyed, source, configFactory(), options)
      assert.deepEqual(
        actual,
        expected,
        'baseline mismatch at ' + sourceIndex + ':' + configIndex + ':' + optionIndex
      )
      comparisons += 1
    })

    if (sourceIndex < 13) {
      var buildOptions = { buildAst: true }
      var expectedAst = outcome(baseline, source, configFactory(), buildOptions)
      var actualAst = outcome(redeyed, source, configFactory(), buildOptions)
      assert.deepEqual(
        actualAst,
        expectedAst,
        'AST baseline mismatch at ' + sourceIndex + ':' + configIndex
      )
      comparisons += 1
    }
  })
})

console.log('Compatibility checks passed: ' + comparisons + ' differential executions.')
