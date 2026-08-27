import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'

const source = await readFile(new URL('../dist/redeyed.global.js', import.meta.url), 'utf8')
const context = { console }
vm.runInNewContext(source, context, { filename: 'redeyed.global.js' })

assert.equal(typeof context.Redeyed.default, 'function')
assert.equal(
  context.Redeyed.default('return true', {
    Keyword: { _default: '<:>' }
  }).code,
  '<return> true'
)
assert.equal(context.Redeyed.redeyed, context.Redeyed.default)

console.log('Browser bundle checks passed.')
