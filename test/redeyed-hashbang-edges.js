'use strict'

var test = require('tape')
var redeyed = require('..')

test('preserves a hashbang-only source', function (t) {
  var source = '#!/usr/bin/env node'
  t.equal(redeyed(source, {}).code, source)
  t.end()
})

test('preserves CRLF hashbangs', function (t) {
  var source = '#!/usr/bin/env node\r\nvar value = 1'
  var result = redeyed(source, { Keyword: { var: '<:>' } })
  t.equal(result.code, '#!/usr/bin/env node\r\n<var> value = 1')
  t.end()
})

test('handles a large hashbang without argument expansion', function (t) {
  var source = '#!' + new Array(200001).join('x') + '\nvar value = 1'
  var result = redeyed(source, { Keyword: { var: '<:>' } })
  t.equal(result.code.slice(0, 2), '#!')
  t.equal(result.code.length, source.length + 2)
  t.ok(result.code.endsWith('<var> value = 1'))
  t.end()
})
