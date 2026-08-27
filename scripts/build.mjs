import { mkdir } from 'node:fs/promises'
import { build } from 'esbuild'

const outdir = new URL('../dist/', import.meta.url)
await mkdir(outdir, { recursive: true })

const shared = {
  bundle: true,
  legalComments: 'external',
  minify: true,
  platform: 'browser',
  target: ['es2018']
}

await Promise.all([
  build({
    ...shared,
    entryPoints: [new URL('../index.mjs', import.meta.url).pathname],
    format: 'cjs',
    outfile: new URL('redeyed.browser.cjs', outdir).pathname
  }),
  build({
    ...shared,
    entryPoints: [new URL('../index.mjs', import.meta.url).pathname],
    format: 'esm',
    outfile: new URL('redeyed.browser.mjs', outdir).pathname
  }),
  build({
    ...shared,
    entryPoints: [new URL('../index.mjs', import.meta.url).pathname],
    format: 'iife',
    globalName: 'Redeyed',
    outfile: new URL('redeyed.global.js', outdir).pathname
  })
])

console.log('Built self-contained CommonJS, ESM, and global browser artifacts.')
