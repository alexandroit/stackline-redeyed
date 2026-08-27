# Migration

## Direct Stackline Name

```bash
npm install @stackline/redeyed
```

```js
const redeyed = require('@stackline/redeyed');
```

## Preserve Existing Imports

```bash
npm install redeyed@npm:@stackline/redeyed
```

Existing source remains unchanged:

```js
const redeyed = require('redeyed');
```

## Modern Parser Opt-In

The default remains Esprima. Applications that already use Espree can opt in:

```js
const espree = require('espree');
const result = redeyed(source, config, {
  parser: espree,
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  }
});
```

Parser-specific token types are intentional. Test themes before changing a
parser in an existing application.
