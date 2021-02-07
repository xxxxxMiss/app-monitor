import { AnyCnameRecord } from 'dns'

export interface HttpResponse {
  code: number
  msg?: string
  data: any
}
