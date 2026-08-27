import assert from 'node:assert/strict'
import redeyed, { redeyed as namedRedeyed } from '../index.mjs'

assert.equal(redeyed, namedRedeyed)
assert.equal(
  redeyed('return true', { Keyword: { _default: '<:>' } }).code,
  '<return> true'
)

console.log('Native ESM checks passed.')
