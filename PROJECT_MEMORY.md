---
schema: stackline-project-memory-v1
package: redeyed
upstream: https://github.com/thlorenz/redeyed
stackline_package: "@stackline/redeyed"
state: PUBLISHED
registry_scope: verdaccio-only
public_npm: false
public_github: false
created: 2026-08-26
last_updated: 2026-08-26
---

# Project Memory

## Objective

Preserve the source-retaining token wrapping API of `redeyed@2.1.1` while
making configuration processing non-mutating and prototype-safe, supporting
current parser return styles as an opt-in extension, and shipping a clean,
verifiable package artifact.

## Upstream Identity

- npm: `redeyed@2.1.1`
- repository: https://github.com/thlorenz/redeyed
- license: MIT, copyright 2012 Thorsten Lorenz
- latest npm publish: 2018-05-22
- latest repository commit: 2021-11-02
- repository state: public, unarchived, one open issue, no open pull requests

## Distribution Snapshot

- `redeyed`: 5,953,668 downloads for 2026-08-19 through 2026-08-25
- `cardinal`: 5,956,826 downloads for the same complete week
- `esprima`: 110,834,638 downloads for the same complete week
- source: official npm downloads API

`cardinal@2.1.1` directly depends on `redeyed@~2.1.0` and calls the public
function for JavaScript terminal highlighting.

## Verified Gaps

1. The npm artifact still contains 31 files, including an example that loads
   jQuery 1.8.1 over HTTP. Upstream PR #24 added an explicit `files` list in
   2021 but was never released. Issue #22 is an artifact-scanner finding, not a
   runtime advisory against redeyed.
2. Valid configuration is mutated by adding `_parent` cycles. It can no longer
   be JSON-serialized after a call, and frozen configurations throw.
3. Null-prototype configurations and the legitimate token key
   `hasOwnProperty` throw because the implementation invokes an input-owned
   method.
4. Custom tokenizers that return token arrays, including modern Espree, are
   ignored because only Esprima's delegate callback is consumed.
5. Esprima remains a compatible default but cannot tokenize some modern syntax
   such as numeric separators, BigInt literals, and private fields.

## Compatibility Boundary

Preserve the callable function, config string/object/function forms, wrapper
inheritance, callback info, token skipping, comments, JSX/buildAst, nojoin,
hashbang restoration, UMD behavior, result shape, and default Esprima token
semantics. Modern parser support is opt-in through existing `opts.parser` plus
new `opts.parserOptions`; Esprima remains the default.

## Decision Gates

- legal/provenance: PASS - clear MIT grant and copyright
- real problem: PASS - unreleased artifact fix and four reproduced failures
- forward-looking necessity: PASS - active cardinal chain and modern syntax
- differentiation: PASS - source-preserving configurable token transformation
  differs from complete syntax-highlighting frameworks
- compatibility feasibility: PASS - 187 upstream assertions plus differential
  oracle and direct cardinal adoption path
- maintenance burden: PASS - one small runtime module and one parser dependency
- adoption path: PASS - cardinal is direct, measurable, and locally testable
- evidence path: PASS - package contents, immutability, malicious keys, parser
  adapters, browsers, types, and downstream behavior can all be automated

## Decision

GO.

## Implementation Status

Implementation, verification, packaging, and downstream adoption validation
are complete. `@stackline/redeyed@1.0.0` is published only to the local
Verdaccio registry. Public npm and public GitHub publication were not
performed.

## Final Verification

- 224 upstream and regression assertions passed.
- 1,230 differential executions matched the official `redeyed@2.1.1` oracle.
- Coverage: 95.59% lines, 92.48% branches, and 100% functions.
- TypeScript 3.9.10 and 7.0.2 compile tests passed for CommonJS and ESM.
- Browser global, ESM, packed-install, direct Verdaccio, and npm-alias smoke
  tests passed.
- `publint` reported no findings and AreTheTypesWrong reported all entry points
  green, including `config` and `config-es5`.
- The complete upstream `cardinal@2.1.1` suite passed 174 assertions and lint
  after installing the Verdaccio package through the legacy `redeyed` alias.
- Production audit reported zero vulnerabilities.
- 303 dependency signatures and 26 attestations were verified.

## Verdaccio Artifact

- package: `@stackline/redeyed@1.0.0`
- tag: `latest`
- files: 18
- packed size: 106.2 kB
- unpacked size: 465.1 kB
- SHA-1: `c7ab6e5e989034ac2f94b91e2c8fe587f72bb54e`
- integrity: `sha512-xukSXiH1rIJU3lJ+UIuS7GvoFgTnAn37zmHe1nIe96tzwvOAYho9vhgMxl5JQbfaczCPXuKhyqgfciRMM9BjQw==`

## Chronological Log

- 2026-08-26: npm, repository history, issues, pull requests, forks,
  dependents, alternatives, licenses, advisories, and package contents audited.
- 2026-08-26: upstream suite passed 187 assertions on Node.js 20.
- 2026-08-26: upstream development audit reported six findings; production
  dependency audit reported zero findings.
- 2026-08-26: all 268 installed baseline packages had verified registry
  signatures.
- 2026-08-26: config mutation/frozen/null-prototype/reserved-key failures and
  modern default-parser limits reproduced.
- 2026-08-26: GO approved before implementation.
- 2026-08-26: configuration compilation made immutable and prototype-safe;
  callback and collection parser adapters, bounded hashbang handling, module
  exports, browser artifacts, and first-party types implemented.
- 2026-08-26: all verification gates passed, including the full Cardinal
  consumer suite against the packed Verdaccio artifact.
- 2026-08-26: `@stackline/redeyed@1.0.0` published to Verdaccio only; official
  npm and public GitHub remained untouched.
