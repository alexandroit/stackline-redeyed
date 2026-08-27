import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = path.resolve(new URL('..', import.meta.url).pathname)
const temporary = await mkdtemp(path.join(os.tmpdir(), 'stackline-cardinal-'))

try {
  await writeFile(path.join(temporary, 'package.json'), JSON.stringify({
    private: true,
    dependencies: {
      '@stackline/redeyed': 'file:' + root,
      cardinal: '2.1.1'
    }
  }))
  const installed = spawnSync('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], {
    cwd: temporary,
    encoding: 'utf8'
  })
  assert.equal(installed.status, 0, installed.stderr)

  const cardinalModules = path.join(temporary, 'node_modules', 'cardinal', 'node_modules')
  await mkdir(cardinalModules, { recursive: true })
  await rm(path.join(temporary, 'node_modules', 'redeyed'), { force: true, recursive: true })
  await symlink(
    path.join(temporary, 'node_modules', '@stackline', 'redeyed'),
    path.join(cardinalModules, 'redeyed'),
    'dir'
  )

  const checked = spawnSync(process.execPath, ['-e', [
    "const cardinal = require('cardinal');",
    "const output = cardinal.highlight('var value = 1;');",
    "if (!output.includes('value')) process.exit(1);",
    "if (!output.includes(String.fromCharCode(27) + '[')) process.exit(1);"
  ].join('')], { cwd: temporary, encoding: 'utf8' })
  assert.equal(checked.status, 0, checked.stderr)
} finally {
  await rm(temporary, { force: true, recursive: true })
}

console.log('Cardinal adoption-path smoke test passed.')
