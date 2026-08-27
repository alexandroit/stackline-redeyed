# Upstream Audit

Audit date: 2026-08-26

## Identity And Maintenance

| Field | Evidence |
| --- | --- |
| npm package | `redeyed@2.1.1` |
| Repository | https://github.com/thlorenz/redeyed |
| License | MIT |
| Latest npm release | 2018-05-22 |
| Latest repository commit | 2021-11-02 |
| Repository | Unarchived; default branch `master` |
| Current open work | Issue #22; no open pull requests |

The last two commits updated an example dependency and limited future package
contents. The maintainer said PR #24 would be published when bandwidth allowed,
but no npm release followed. The project is described as dormant with an
unreleased packaging fix, not falsely labeled officially abandoned or EOL.

## Distribution And Reach

Official npm complete-week observations for 2026-08-19 through 2026-08-25:

| Package | Downloads | Relevance |
| --- | ---: | --- |
| `redeyed` | 5,953,668 | audited package |
| `cardinal` | 5,956,826 | direct runtime dependent |
| `esprima` | 110,834,638 | default parser dependency |

`cardinal@2.1.1` depends on `redeyed@~2.1.0` and calls it from
`lib/highlight.js`. Project 07 in the fixed Stackline roster will consume this
package after Projects 05 and 06 pass.

## Issues And Pull Requests

- Issue #3 documented context-insensitive keyword tokens; maintainers kept this
  as a parser/token-level contract rather than an AST semantic promise.
- Issue #8 and PR #9 introduced tokenizer-first operation and optional AST
  construction. Released in major version 1.0.0.
- Issue #14 and PR #15 preserved hashbangs. Released in 1.0.1.
- PR #17 upgraded Esprima for exponentiation syntax. Later releases moved to
  Esprima 4.
- Issue #21 requested smaller npm contents.
- Issue #22 reports jQuery CVEs from the packaged browser example. The
  maintainer correctly identified it as non-runtime example code while
  accepting artifact exclusion as a scanner workaround.
- PR #23 upgraded the example jQuery URL and was merged after 2.1.1.
- PR #24 added `files: ["redeyed.js"]`, was merged after 2.1.1, and was not
  published.
- PR #7 proposed Espree as the default and was superseded by tokenizer-first
  operation. Stackline will not silently switch the default parser.

No unreleased runtime behavior patch exists beyond the package-content work.

## Baseline Verification

- Upstream test suite: 187/187 assertions passed.
- Production audit: zero known advisories.
- Full legacy development tree: five moderate and one high finding, all from
  obsolete lint tooling.
- Registry signatures: 268/268 installed packages verified.
- GitHub reviewed advisory search returned no advisory affecting `redeyed` or
  `esprima`.

No CVE or GHSA is attributed to the redeyed runtime.

## Reproduced Correctness Gaps

- A normal config receives `_parent` keys and circular references.
- `JSON.stringify(config)` fails after one call.
- frozen configs throw while being normalized.
- null-prototype configs throw because `node.hasOwnProperty` is called.
- configuring an Identifier named `hasOwnProperty` throws for the same reason.
- a custom modern tokenizer returning an array produces no transformed tokens.
- default Esprima tokenization rejects numeric separators, BigInt, and private
  identifiers.
- a hashbang-only file and unusually long hashbang can fail in the old masking
  path.

## Alternatives

Shiki, Prism, Highlight.js, Refractor, and cli-highlight are maintained syntax
highlighting systems. They are not drop-in replacements for redeyed's generic
source-preserving token wrapper callbacks, token skipping, parser injection,
AST return, and split output. Espree and Acorn are parsers, not replacements for
the transformation API.

## Decision

GO: preserve the old function and default parser semantics, make config
normalization pure and safe, accept callback- and array-style tokenizers, expose
parser options, add first-party modules/types, ship only intentional files, and
validate cardinal without changing its source imports.
