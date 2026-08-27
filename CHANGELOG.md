# Changelog

All notable changes to this project are documented in this file.

The format is based on Keep a Changelog and this project follows Semantic
Versioning.

## [Unreleased]

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

[Unreleased]: https://github.com/alexandroit/stackline-redeyed/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/alexandroit/stackline-redeyed/releases/tag/v1.0.0
