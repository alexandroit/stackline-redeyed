# Registry Handoff

## Current State

- Upstream: `redeyed@2.1.1`
- Stackline target: `@stackline/redeyed@1.0.1`
- Decision: GO
- State: PUBLIC RELEASE COMPLETE
- Registry scope: Verdaccio and official npm
- Runtime dependencies: `esprima@4.0.1`
- GitHub: https://github.com/alexandroit/stackline-redeyed
- Docs: https://alexandro.net/docs/vanilla/redeyed/

## Delivered Delta

Preserves the 2.1.1 transformation contract while compiling configs without
mutation, handling dangerous/property-shadowing keys safely, accepting modern
array-returning custom tokenizers, hardening hashbang handling, adding current
module/type/browser contracts, and excluding the stale browser example from
the package artifact.

## Artifact Evidence

- Dist tag: `latest`
- SHA-1: `1536e65fc22c07c96e6fc583ef58d054e343d131`
- Integrity: `sha512-0x3Bpp2zeaPSTlEHpvvfY5OvDpS7bdrRzgyWBdGv3BAjFYISi1p/hbt1qZbfbEwwb91olSjznXVqakGoxVO6QA==`
- Direct scoped install: PASS
- Legacy alias install as `redeyed`: PASS
- Cardinal 2.1.1 downstream suite: 174 assertions and lint PASS
- Production audit: zero vulnerabilities
- Official npm scoped and alias installs: PASS
- CI and CodeQL: PASS
- GitHub release: tarball, SHA512SUMS, and CycloneDX SBOM attached
- Third-party license inventory: exact Esprima BSD-2-Clause license included

## Next Project

Projects 04 and 06 are also public. Project 07 (`cardinal`) is the next fixed
roadmap item and can consume this package through the historical `redeyed`
alias.
