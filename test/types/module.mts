import redeyed, { redeyed as namedRedeyed } from '../../index.mjs'

const result = redeyed('return true', {
  Keyword: { _default: '<:>' }
}, {
  nojoin: false,
  parserOptions: { sourceType: 'script' }
})

const sameFunction: typeof redeyed = namedRedeyed
const code: string | undefined = result.code

void sameFunction
void code
