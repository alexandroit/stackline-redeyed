import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const registry = process.env.STACKLINE_REGISTRY || 'http://127.0.0.1:4873'
const temporary = await mkdtemp(path.join(os.tmpdir(), 'stackline-redeyed-registry-'))

try {
  await writeFile(path.join(temporary, 'package.json'), JSON.stringify({
    private: true,
    dependencies: {
      '@stackline/redeyed': '1.0.0',
      redeyed: 'npm:@stackline/redeyed@1.0.0'
    }
  }))

  const installed = spawnSync('npm', [
    'install',
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    '--registry',
    registry
  ], { cwd: temporary, encoding: 'utf8' })
  assert.equal(installed.status, 0, installed.stderr)

  const checked = spawnSync(process.execPath, ['-e', [
    "const direct = require('@stackline/redeyed');",
    "const alias = require('redeyed');",
    "const config = { Keyword: { _default: '<:>' } };",
    "if (direct('return true', config).code !== '<return> true') process.exit(1);",
    "if (alias('return true', config).code !== '<return> true') process.exit(1);"
  ].join('')], { cwd: temporary, encoding: 'utf8' })
  assert.equal(checked.status, 0, checked.stderr)
} finally {
  await rm(temporary, { force: true, recursive: true })
}

console.log('Verdaccio direct and legacy-alias install checks passed.')
