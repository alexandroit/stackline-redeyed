import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = path.resolve(new URL('..', import.meta.url).pathname)
const temporary = await mkdtemp(path.join(os.tmpdir(), 'stackline-redeyed-'))

try {
  const packed = spawnSync('npm', ['pack', '--json', '--ignore-scripts'], {
    cwd: root,
    encoding: 'utf8'
  })
  assert.equal(packed.status, 0, packed.stderr)
  const packResult = JSON.parse(packed.stdout)
  const tarball = path.join(root, packResult[0].filename)

  await writeFile(path.join(temporary, 'package.json'), JSON.stringify({
    private: true,
    dependencies: {
      '@stackline/redeyed': 'file:' + tarball
    }
  }))

  const installed = spawnSync('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], {
    cwd: temporary,
    encoding: 'utf8'
  })
  assert.equal(installed.status, 0, installed.stderr)

  const commonjs = spawnSync(process.execPath, ['-e', [
    "const redeyed = require('@stackline/redeyed');",
    "const config = require('@stackline/redeyed/config');",
    "if (typeof config !== 'object') process.exit(1);",
    "if (redeyed('return true', { Keyword: { _default: '<:>' } }).code !== '<return> true') process.exit(1);"
  ].join('')], { cwd: temporary, encoding: 'utf8' })
  assert.equal(commonjs.status, 0, commonjs.stderr)

  const esm = spawnSync(process.execPath, ['--input-type=module', '-e', [
    "import redeyed, { redeyed as named } from '@stackline/redeyed';",
    "if (redeyed !== named) process.exit(1);",
    "if (redeyed('const value = 1', { Keyword: { _default: '<:>' } }).code !== '<const> value = 1') process.exit(1);"
  ].join('')], { cwd: temporary, encoding: 'utf8' })
  assert.equal(esm.status, 0, esm.stderr)

  const manifest = JSON.parse(await readFile(path.join(
    temporary,
    'node_modules',
    '@stackline',
    'redeyed',
    'package.json'
  ), 'utf8'))
  assert.equal(manifest.name, '@stackline/redeyed')
  await rm(tarball, { force: true })
} finally {
  await rm(temporary, { force: true, recursive: true })
}

console.log('Packed scoped-install smoke test passed.')
