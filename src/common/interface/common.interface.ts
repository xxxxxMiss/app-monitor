export interface HttpResponse {
  code: number
  msg?: string
  data: any
}

export interface File {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  buffer: Buffer
  size: number
}
