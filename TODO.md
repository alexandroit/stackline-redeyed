# TODO

- [x] Replace the abandoned Esprima edge with maintained `@stackline/esprima`.
- [x] Preserve the historical `esprima` dependency key through an exact alias.
- [x] Add warning-free install, dependency-tree, and audit release gates.
- [ ] Revalidate the complete production chain before every release.
- [ ] Upgrade only when the redeyed 2.1.1 compatibility contract remains green.
- [ ] Register `alexandroit/stackline-redeyed` and `publish.yml` as the npm
  Trusted Publisher before the next release so provenance publication is OIDC-only.
