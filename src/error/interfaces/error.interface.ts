export interface ErrorMsg {
  line: number
  column: number
  message: string
  source: string
  stack: string
}

export interface Error {
  line: number
  column: number
  name?: string
  text?: string
  source: string
}
