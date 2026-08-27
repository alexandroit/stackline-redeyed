# @stackline/redeyed

> Source-preserving JavaScript token transforms with immutable configuration
> and pluggable parsers.

[![npm version](https://img.shields.io/npm/v/@stackline/redeyed.svg?style=flat-square)](https://www.npmjs.com/package/@stackline/redeyed)
[![npm downloads](https://img.shields.io/npm/dm/@stackline/redeyed.svg?style=flat-square)](https://www.npmjs.com/package/@stackline/redeyed)
[![CI](https://img.shields.io/github/actions/workflow/status/alexandroit/stackline-redeyed/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/alexandroit/stackline-redeyed/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@stackline/redeyed.svg?style=flat-square)](LICENSE)

**[Docs and transformer](https://alexandro.net/docs/vanilla/redeyed/)** |
**[npm](https://www.npmjs.com/package/@stackline/redeyed)** |
**[GitHub](https://github.com/alexandroit/stackline-redeyed)** |
**[Migration](MIGRATION.md)** |
**[Security](SECURITY.md)** |
**[Changelog](CHANGELOG.md)**

**Current package version:** `1.0.1`

This package is an independent, maintained continuation of
[`redeyed`](https://github.com/thlorenz/redeyed). It preserves the established
2.1.1 callable API and Esprima defaults while removing config mutation, safely
handling property-like token names, and supporting current array-returning
tokenizers as an opt-in extension.

## Install

```bash
npm install @stackline/redeyed
```

Preserve existing `require('redeyed')` calls with an npm alias:

```bash
npm install redeyed@npm:@stackline/redeyed
```

## Quick Start

```js
const redeyed = require('@stackline/redeyed')

const result = redeyed(
  'const answer = 42',
  {
    Keyword: { _default: '<strong>:</strong>' },
    Numeric: { _default: '<mark>:</mark>' }
  }
)

console.log(result.code)
// <strong>const</strong> answer = <mark>42</mark>
```

A string transform uses `before:after`. Object and function forms are also
supported:

```js
const config = {
  Identifier: {
    answer: { _before: '[', _after: ']' },
    _default: (source, info) => {
      return info.tokenIndex === 0 ? source.toUpperCase() : source
    }
  }
}
```

The caller's config is never changed. Frozen objects, null-prototype maps, and
token names such as `hasOwnProperty`, `__proto__`, `constructor`, and
`prototype` are processed as data.

## API

### `redeyed(code, config[, options])`

Returns:

```js
{
  ast,
  tokens,
  comments,
  splits,
  code
}
```

Options:

| Option | Default | Purpose |
| --- | --- | --- |
| `buildAst` | `false` | Parse and return an AST instead of tokenizer-only operation |
| `jsx` | `false` | Enable the historical JSX parsing path |
| `nojoin` | `false` | Return splits without joining transformed code |
| `parser` | Esprima 4 | Supply an Esprima-compatible or array-returning parser |
| `parserOptions` | `{}` | Pass parser-specific settings |

Function transforms receive `(tokenSource, info)`. `info` contains the merged
token index, tokens and comments, AST when requested, and source. A transform
can return a string or:

```js
{
  replacement: 'new source',
  skipPastToken: info.tokens[targetIndex]
}
```

## Modern Syntax

Esprima remains the default to avoid silently changing token labels and ASTs.
For modern syntax, opt in to a parser already used by your application:

```bash
npm install espree
```

```js
const espree = require('espree')
const redeyed = require('@stackline/redeyed')

const result = redeyed(
  'class Box { #value = 1_000n }',
  {
    PrivateIdentifier: { _default: '<:>' },
    Numeric: { _default: '[:]' }
  },
  {
    parser: espree,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  }
)
```

Parser-specific token types remain parser-specific. Array tokenizers can expose
comments only when their return data includes comments; `buildAst: true` uses
the parser's AST tokens and comments.

## Modules And Browser

- Callable CommonJS entry
- Native ESM default and named exports
- First-party TypeScript declarations, including TypeScript 3.9 consumers
- Self-contained browser CJS, ESM, and global bundles
- Original UMD behavior retained in `redeyed.js`
- Node.js 12 and newer at runtime

The package also exports starter configs:

```js
const config = require('@stackline/redeyed/config')
const es5Config = require('@stackline/redeyed/config-es5')
```

## Package Integrity

The old 2.1.1 npm artifact includes an example that references jQuery 1.8.1.
That example is not runtime code, but it triggers dependency scanners. The
Stackline artifact ships only runtime entries, configs, types, documentation,
licenses, and generated browser bundles. No redeyed runtime CVE is claimed.

The maintained suite includes all 187 upstream assertions, more than 1,000
differential executions, immutable and hostile-key configs, modern parser
adapters, hashbang edges, browser/modules/types, package audits, and a direct
`cardinal` adoption check.

## Security

Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).
Please do not publish an unpatched report in a public issue.

## Provenance

The source history, decisions, and preserved boundary are recorded in
[UPSTREAM_AUDIT.md](UPSTREAM_AUDIT.md),
[COMPATIBILITY_CONTRACT.md](COMPATIBILITY_CONTRACT.md), and [NOTICE](NOTICE).
Stackline is not affiliated with or endorsed by the upstream author.

## License

MIT. The original copyright and permission notice remain in
[LICENSE](LICENSE). Browser bundles also retain Esprima's BSD-2-Clause legal
terms in [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).
