# Changelog

All notable changes to this project are documented in this file.

The format is based on Keep a Changelog and this project follows Semantic
Versioning.

## [Unreleased]

## [1.0.2] - 2026-08-30

### Changed

- Preserve the historical `esprima` dependency key while resolving it exactly
  to maintained `@stackline/esprima@1.0.0`.
- Require warning-free packed installs, valid dependency trees, and zero
  production and full-lockfile audit findings.
- Correct the npm publication workflow to address the local tarball path
  explicitly.

## [1.0.1] - 2026-08-26

### Added

- Public token-transform playground and machine-readable documentation.
- Verbatim Esprima BSD-2-Clause redistribution terms for embedded browser
  bundles.
- Pinned CI, CodeQL, and immutable npm publication workflows.
- Documentation build, crawler metadata, package checks, and production audit
  gates.

## [1.0.0] - 2026-08-26

### Added

- Immutable, null-prototype configuration compilation.
- Safe support for shadowed and prototype-like token keys.
- Array-returning custom tokenizer support and `parserOptions`.
- Native ESM, first-party TypeScript declarations, and browser bundles.
- Differential, frozen-config, hostile-key, parser, hashbang, package, and
  cardinal adoption regressions.
- Current security, migration, compatibility, and provenance documentation.

### Changed

- Package name to `@stackline/redeyed` for independent maintenance.
- Hashbang masking to bounded string construction with no-newline support.
- Development tooling to a current, audit-clean release pipeline.
- Published files to an explicit runtime and documentation allowlist.

### Preserved

- Callable CommonJS and UMD APIs.
- Esprima 4 default behavior.
- Existing config precedence, callbacks, token skipping, JSX/AST/nojoin, result
  shape, comments, splits, and source retention.
- Original MIT copyright and permission notice.

[Unreleased]: https://github.com/alexandroit/stackline-redeyed/compare/stackline-v1.0.2...HEAD
[1.0.2]: https://github.com/alexandroit/stackline-redeyed/compare/stackline-v1.0.1...stackline-v1.0.2
[1.0.1]: https://github.com/alexandroit/stackline-redeyed/compare/stackline-v1.0.0...stackline-v1.0.1
[1.0.0]: https://github.com/alexandroit/stackline-redeyed/tree/stackline-v1.0.0
