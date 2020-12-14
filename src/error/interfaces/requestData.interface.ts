export interface RequestData {
  data: {
    type: string
    data: number[]
  }
  options: {
    version: string
    filename: string
    [key: string]: any
  }
}
