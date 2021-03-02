export interface HttpResponse<T = any> {
  code: number
  msg?: string
  data: T
}

export interface File {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  buffer: Buffer
  size: number
}
