declare function redeyed(
  code: string,
  config: redeyed.Config,
  options?: redeyed.Options
): redeyed.Result

declare namespace redeyed {
  interface Position {
    line: number
    column: number
  }

  interface SourceLocation {
    start: Position
    end: Position
  }

  interface Token {
    type: string
    value: string
    range: [number, number]
    loc?: SourceLocation
    [key: string]: unknown
  }

  interface TransformInfo {
    tokenIndex: number
    tokens: Token[]
    ast: unknown
    code: string
  }

  interface Replacement {
    replacement: string
    skipPastToken: Token
  }

  type TransformResult = string | Replacement
  type Transform = (tokenSource: string, info: TransformInfo) => TransformResult

  interface Surround {
    _before?: string
    _after?: string
  }

  type ConfigValue = string | Surround | Transform | ConfigNode | null | false | undefined

  interface ConfigNode {
    [key: string]: ConfigValue
  }

  type Config = ConfigNode

  interface Parser {
    parse(code: string, options: Record<string, unknown>): any
    tokenize(
      code: string,
      options: Record<string, unknown>,
      delegate?: (token: Token) => void
    ): any
  }

  interface Options {
    buildAst?: boolean
    jsx?: boolean
    nojoin?: boolean
    parser?: Parser
    parserOptions?: Record<string, unknown>
  }

  interface Result {
    ast: unknown
    tokens: Token[]
    comments: Token[]
    splits: unknown[]
    code: string | undefined
  }
}

export { redeyed }
export default redeyed
