import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IError } from '../interfaces/error.interface'
import { Document } from 'mongoose'

@Schema()
export class Error {
  @Prop()
  projectName?: string
  @Prop()
  version?: string
  @Prop()
  stackMsg: string
  @Prop()
  compressions: IError[]
  @Prop()
  sources: IError[]
}

export type ErrorDocument = Error & Document

export const ErrorSchema = SchemaFactory.createForClass(Error)
