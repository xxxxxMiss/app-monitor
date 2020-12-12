import { Error } from '../interfaces/error.interface'

export class CreateErrorDto {
  projectName: string
  version: string
  message: string
  stack: string
  compressions: Error[]
  sources: Error[]
}
