# Adoption Targets

## Primary

`cardinal@2.1.1` is the required representative downstream. It directly
depends on `redeyed@~2.1.0` and calls the function from `lib/highlight.js`.
Before release readiness, its full suite and representative highlighting must
pass with the dependency key `redeyed` mapped to `@stackline/redeyed`.

Project 07 (`@stackline/cardinal`) will consume this package through an npm
alias after Projects 05 and 06 are validated.

## Secondary

- `thlorenz/peacock`
- active repositories with direct `redeyed` manifests found during adoption
  research
- consumers receiving redeyed transitively through cardinal

No outreach or pull request is part of the build gate. Adoption work begins
only after an authorized public release.
