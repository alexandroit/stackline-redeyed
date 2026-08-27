# Compatibility Contract

Baseline: `redeyed@2.1.1`

## Public API

```js
const redeyed = require('redeyed');
const result = redeyed(code, config, options);
```

The default export remains one synchronous callable function.

## Preserved Behavior

- Esprima 4 remains the default parser.
- Tokenizer-first operation remains the default.
- `buildAst`, `jsx`, `nojoin`, and `parser` remain supported.
- String, object, and callback config values retain their behavior.
- Type defaults, root defaults, and exact token overrides retain precedence.
- Transform callbacks receive `tokenIndex`, merged tokens, AST, and source.
- Replacement callbacks may skip through a selected token.
- Hashbangs, comments, gaps, and unmodified source text retain positions.
- The result contains `ast`, `tokens`, `comments`, `splits`, and `code` with the
  same optionality as 2.1.1.
- Browser UMD usage remains available.

## Maintained Extensions

- Input configs are no longer mutated and frozen configs are accepted.
- Null-prototype configs and token names such as `hasOwnProperty`, `__proto__`,
  `constructor`, and `prototype` are handled as data without prototype changes.
- Existing `opts.parser` accepts tokenizers that return arrays in addition to
  Esprima-style delegate callbacks.
- `opts.parserOptions` passes parser-specific options while required token
  location options remain enabled.
- Native ESM, first-party TypeScript declarations, and self-contained browser
  bundles are supplied.
- Hashbang masking is bounded and supports files without a trailing newline.

## Parser Boundary

Passing another parser is opt-in. Token labels and comments are parser-defined;
the package does not pretend Espree, Babel, Acorn, and Esprima produce identical
tokens or ASTs. Array-returning tokenizers can only expose comments if their
returned data includes them. `buildAst: true` uses the parser's parse result.

## Runtime Target

Node.js 12 and newer plus current browser bundlers. Development tooling may
require a current Node.js LTS release.
