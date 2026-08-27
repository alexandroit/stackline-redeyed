# Registry Handoff

## Current State

- Upstream: `redeyed@2.1.1`
- Stackline target: `@stackline/redeyed@1.0.0`
- Decision: GO
- State: PUBLISHED
- Registry scope: Verdaccio only (`http://127.0.0.1:4873`)
- Runtime dependencies: `esprima@4.0.1`
- Public npm publication: not authorized and not performed

## Delivered Delta

Preserves the 2.1.1 transformation contract while compiling configs without
mutation, handling dangerous/property-shadowing keys safely, accepting modern
array-returning custom tokenizers, hardening hashbang handling, adding current
module/type/browser contracts, and excluding the stale browser example from
the package artifact.

## Artifact Evidence

- Dist tag: `latest`
- SHA-1: `c7ab6e5e989034ac2f94b91e2c8fe587f72bb54e`
- Integrity: `sha512-xukSXiH1rIJU3lJ+UIuS7GvoFgTnAn37zmHe1nIe96tzwvOAYho9vhgMxl5JQbfaczCPXuKhyqgfciRMM9BjQw==`
- Direct scoped install: PASS
- Legacy alias install as `redeyed`: PASS
- Cardinal 2.1.1 downstream suite: 174 assertions and lint PASS
- Production audit: zero vulnerabilities
- Public npm: untouched
- Public GitHub: untouched

## Next Project

Project 06 (`ansicolors`) may enter RESEARCHING after this handoff is mirrored
to the central Google Drive memory.
