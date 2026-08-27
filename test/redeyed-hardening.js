'use strict'

var test = require('tape')
var redeyed = require('..')

test('does not mutate or annotate a normal config', function (t) {
  var config = {
    Keyword: {
      _default: { _before: '<', _after: '>' }
    }
  }
  var before = JSON.stringify(config)

  t.equal(redeyed('return true', config).code, '<return> true')
  t.equal(JSON.stringify(config), before)
  t.notOk(Object.prototype.hasOwnProperty.call(config.Keyword, '_parent'))
  t.end()
})

test('accepts deeply frozen configs', function (t) {
  var config = Object.freeze({
    Keyword: Object.freeze({
      _default: Object.freeze({ _before: '<', _after: '>' })
    })
  })

  t.equal(redeyed('return true', config).code, '<return> true')
  t.end()
})

test('accepts null-prototype configs and shadowed property names', function (t) {
  var config = Object.create(null)
  var identifiers = Object.create(null)
  config.Identifier = identifiers
  identifiers._default = '(:)'
  identifiers.hasOwnProperty = '<:>'
  identifiers.__proto__ = '[:]'
  identifiers.constructor = '{:}'
  identifiers.prototype = '/:/'

  var source = 'hasOwnProperty + __proto__ + constructor + prototype + other'
  var expected = '<hasOwnProperty> + [__proto__] + {constructor} + /prototype/ + (other)'

  t.equal(redeyed(source, config).code, expected)
  t.equal(Object.getPrototypeOf(config), null)
  t.equal(Object.getPrototypeOf(identifiers), null)
  t.end()
})

test('treats malicious JSON keys as data without prototype changes', function (t) {
  var config = JSON.parse(
    '{"Identifier":{"__proto__":{"_before":"<","_after":">"},' +
    '"constructor":"[:]",' +
    '"prototype":"{:}"}}'
  )
  var objectPrototypeBefore = Object.getPrototypeOf({})
  var configPrototypeBefore = Object.getPrototypeOf(config.Identifier)

  t.equal(
    redeyed('__proto__ + constructor + prototype', config).code,
    '<__proto__> + [constructor] + {prototype}'
  )
  t.equal(Object.getPrototypeOf({}), objectPrototypeBefore)
  t.equal(Object.getPrototypeOf(config.Identifier), configPrototypeBefore)
  t.equal(Object.prototype.polluted, undefined)
  t.end()
})

test('rejects circular configs with a controlled error', function (t) {
  var config = { Identifier: {} }
  config.Identifier.loop = config

  t.throws(function () {
    redeyed('value', config)
  }, /must not contain circular references/)
  t.end()
})
