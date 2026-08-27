import redeyed = require('../../index')

const config: redeyed.Config = {
  Keyword: {
    _default: '<:>'
  },
  Identifier: {
    _default: (source, info) => {
      const index: number = info.tokenIndex
      void index
      return source.toUpperCase()
    }
  }
}

const result: redeyed.Result = redeyed('return value', config)
const code: string | undefined = result.code

void code
