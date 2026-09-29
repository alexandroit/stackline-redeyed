# @stackline/redeyed

> Source-preserving JavaScript token transforms with immutable configs and parser adapters.

[![npm version](https://img.shields.io/npm/v/@stackline/redeyed.svg?style=flat-square)](https://www.npmjs.com/package/@stackline/redeyed)
[![license](https://img.shields.io/npm/l/@stackline/redeyed.svg?style=flat-square)](https://github.com/alexandroit/stackline-redeyed)
[![GitHub repository](https://img.shields.io/badge/GitHub-repository-181717?style=flat-square&logo=github)](https://github.com/alexandroit/stackline-redeyed)
[![Docs](https://img.shields.io/badge/docs-alexandro.net-0f766e?style=flat-square)](https://alexandro.net/docs/vanilla/redeyed/)
[![Reddit community](https://img.shields.io/badge/community-r%2FStackline-ff4500?style=flat-square&logo=reddit&logoColor=white)](https://www.reddit.com/r/Stackline/)

**[Documentation](https://alexandro.net/docs/vanilla/redeyed/)** | **[npm](https://www.npmjs.com/package/@stackline/redeyed)** | **[Issues](https://github.com/alexandroit/stackline-redeyed/issues)** | **[Repository](https://github.com/alexandroit/stackline-redeyed)**

**Current package version:** `1.0.5`

---

## Why this package?

> Source-preserving JavaScript token transforms with immutable configuration
> and pluggable parsers.




This package is an independent, maintained continuation of
[`redeyed`](https://github.com/thlorenz/redeyed). It preserves the established
2.1.1 callable API and Esprima defaults while removing config mutation, safely
handling property-like token names, and supporting current array-returning
tokenizers as an opt-in extension.

<a id="provenance"></a>

### Provenance

The source history, decisions, and preserved boundary are recorded in
[UPSTREAM_AUDIT.md](https://github.com/alexandroit/stackline-redeyed/blob/main/UPSTREAM_AUDIT.md),
[COMPATIBILITY_CONTRACT.md](https://github.com/alexandroit/stackline-redeyed/blob/main/COMPATIBILITY_CONTRACT.md), and [NOTICE](https://github.com/alexandroit/stackline-redeyed/blob/main/NOTICE).
Stackline is not affiliated with or endorsed by the upstream author.

## Compatibility

| Item | Value |
| --- | --- |
| Package | `@stackline/redeyed@1.0.5` |
| Node.js runtime | `>=12` |
| CommonJS / primary entry | `./redeyed.js` |
| ES module entry | `./index.mjs` |
| Type declarations | `./index.d.ts` |

## Installation

<a id="install"></a>

### Install

```bash
npm install @stackline/redeyed
```

Preserve existing `require('redeyed')` calls with an npm alias:

```bash
npm install redeyed@npm:@stackline/redeyed
```

## Usage

<a id="quick-start"></a>

### Quick Start

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

## Features and Integrations

<a id="modern-syntax"></a>

### Modern Syntax

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

<a id="modules-and-browser"></a>

### Modules And Browser

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

## Security

Report vulnerabilities privately as described in [SECURITY.md](https://github.com/alexandroit/stackline-redeyed/blob/main/SECURITY.md).
Please do not publish an unpatched report in a public issue.

## API Surface

<a id="api"></a>

### API

#### `redeyed(code, config[, options])`

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

## Local Development

```sh
git clone https://github.com/alexandroit/stackline-redeyed.git
cd stackline-redeyed
npm ci
npm run verify
```

Release tooling uses Node.js 24.20.0 and npm 11.19.0. The consumer runtime contract remains the one documented above.

## Consumer Smoke Test

Run the repository's existing consumer/package check after installing development dependencies:

```sh
npm run test:smoke
```

## Release Checklist

<a id="package-integrity"></a>

### Package Integrity

The old 2.1.1 npm artifact includes an example that references jQuery 1.8.1.
That example is not runtime code, but it triggers dependency scanners. The
Stackline artifact ships only runtime entries, configs, types, documentation,
licenses, and generated browser bundles. No redeyed runtime CVE is claimed.

The maintained suite includes all 187 upstream assertions, more than 1,000
differential executions, immutable and hostile-key configs, modern parser
adapters, hashbang edges, browser/modules/types, package audits, and a direct
`cardinal` adoption check.

The historical dependency key `esprima` resolves exactly to the maintained
`@stackline/esprima@1.0.0` compatibility package. It preserves the Esprima
4.0.1 API while keeping the complete production chain under Stackline release,
CI, audit, and provenance controls. A clean install reports no warnings and
zero audit findings.

Run `npm run verify` and inspect the package contents before release. Publish a new version through the [GitHub Actions publishing workflow](https://github.com/alexandroit/stackline-redeyed/actions/workflows/publish.yml), using the SHA-512 digest of the reviewed tarball. Verify the exact published version, tarball integrity, and npm provenance after the run.

## License

MIT. The original copyright and permission notice remain in
[LICENSE](https://github.com/alexandroit/stackline-redeyed/blob/main/LICENSE). Browser bundles also retain Esprima's BSD-2-Clause legal
terms in [THIRD_PARTY_LICENSES.md](https://github.com/alexandroit/stackline-redeyed/blob/main/THIRD_PARTY_LICENSES.md).

## Credits and original authors

- Original project: [redeyed](https://github.com/thlorenz/redeyed).
- Stackline Maintainers.
- Thorsten Lorenz.
- Ariya Hidayat.
- Copyright 2012 Thorsten Lorenz.
- Stackline maintenance: [Alexandro Paixao Marques](https://www.linkedin.com/in/aleinfo/) and [Stackline contributors](https://github.com/alexandroit).

Original copyright, license notices and contributor acknowledgements remain part of this distribution. Stackline maintenance does not replace authorship of the original work.

## Community and Links

- [Stackline website](https://alexandro.net/)
- [GitHub projects](https://github.com/alexandroit)
- [npm packages](https://www.npmjs.com/~alex360qc)
- [Reddit community — r/Stackline](https://www.reddit.com/r/Stackline/)
- [Maintainer LinkedIn](https://www.linkedin.com/in/aleinfo/)

Use this repository's issue tracker for reproducible bugs and feature requests. Join r/Stackline for examples, usage questions and release discussions.
