'use strict'

var test = require('tape')
var espree = require('espree')
var redeyed = require('..')

test('supports array-returning modern tokenizers', function (t) {
  var source = 'class Box { #value = 1_000n; read() { return this.#value } }'
  var result = redeyed(source, {
    PrivateIdentifier: { _default: '<:>' },
    Numeric: { _default: '[:]' }
  }, {
    parser: espree,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  })

  t.equal(
    result.code,
    'class Box { <#value> = [1_000n]; read() { return this.<#value> } }'
  )
  t.ok(result.tokens.length > 0)
  t.equal(result.tokens.filter(function (token) {
    return token.type === 'PrivateIdentifier'
  }).length, 2)
  t.end()
})

test('passes parser options through while enforcing required locations', function (t) {
  var observed
  var parser = {
    tokenize: function (code, options) {
      observed = options
      return [{
        type: 'Identifier',
        value: code,
        range: [0, code.length],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: code.length }
        }
      }]
    }
  }

  t.equal(redeyed('value', {
    Identifier: { _default: '<:>' }
  }, {
    parser: parser,
    parserOptions: {
      comment: false,
      customMode: 'safe',
      loc: false,
      range: false
    }
  }).code, '<value>')
  t.equal(observed.customMode, 'safe')
  t.equal(observed.comment, true)
  t.equal(observed.loc, true)
  t.equal(observed.range, true)
  t.end()
})

test('accepts tokenizers returning token and comment collections', function (t) {
  var parser = {
    tokenize: function () {
      return {
        tokens: [{
          type: 'Identifier',
          value: 'value',
          range: [0, 5]
        }],
        comments: [{
          type: 'Line',
          value: ' note',
          range: [6, 13]
        }]
      }
    }
  }
  var result = redeyed('value // note', {
    Identifier: { _default: '<:>' },
    Line: { _default: '[:]' }
  }, { parser: parser })

  t.equal(result.code, '<value> [// note]')
  t.equal(result.tokens.length, 1)
  t.equal(result.comments.length, 1)
  t.end()
})

test('collects modern parser AST tokens and comments', function (t) {
  var result = redeyed('const value = 1n // note', {
    Line: { _default: '<:>' }
  }, {
    buildAst: true,
    parser: espree,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  })

  t.ok(result.ast)
  t.ok(result.tokens.length > 0)
  t.equal(result.comments.length, 1)
  t.equal(result.code, 'const value = 1n <// note>')
  t.end()
})
