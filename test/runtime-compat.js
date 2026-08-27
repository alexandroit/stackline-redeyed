'use strict'

var assert = require('assert')
var redeyed = require('../redeyed.js')

var config = Object.freeze({
  Keyword: Object.freeze({ _default: '<:>' })
})

assert.strictEqual(redeyed('return true', config).code, '<return> true')
assert.strictEqual(JSON.stringify(config), '{"Keyword":{"_default":"<:>"}}')

console.log('Runtime compatibility checks passed.')
