export interface IErrorMsg {
  line: number
  column: number
  message: string
  source: string
  stack: string
}

export interface IError {
  line: number
  column: number
  name?: string
  text?: string
  source: string
}
