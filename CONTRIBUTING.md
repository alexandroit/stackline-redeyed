# Contributing

Thank you for helping maintain `@stackline/redeyed`.

## Development

Use a current Node.js LTS release:

```bash
npm ci
npm run verify
```

## Compatibility Rules

- Add a regression before changing token, wrapping, split, or result behavior.
- Keep Esprima as the default unless a future major explicitly changes it.
- Treat custom parser labels and ASTs as parser-owned contracts.
- Do not mutate caller code, configuration, tokens, or parser options except for
  the historical comment token type normalization.
- Preserve upstream license and authorship notices.
- Do not add a runtime dependency without a documented necessity review.

Update `CHANGELOG.md` for user-visible changes and keep pull requests focused.
