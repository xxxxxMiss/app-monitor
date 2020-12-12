import { IError } from '../interfaces/error.interface'

export class CreateErrorDto {
  projectName?: string
  version?: string
  message: string
  stackMsg: string
  compressions: IError[]
  sources: IError[]
}
