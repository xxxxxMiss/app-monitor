import { Injectable } from '@nestjs/common'
import { readFileSync } from 'fs'
import { join } from 'path'
import {
  SourceMapConsumer,
  BasicSourceMapConsumer,
  NullableMappedPosition,
} from 'source-map'
import { IErrorMsg, IError } from './interfaces/error.interface'
import { homedir } from 'os'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ErrorDocument, Error } from './schemas/error.schema'
import { CreateErrorDto } from './dto/create-error.dto'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ErrorService {
  constructor(
    @InjectModel(Error.name) private errorModel: Model<ErrorDocument>,
    private configService: ConfigService,
  ) {}

  async resolve(errorMsg: IErrorMsg) {
    const consumer: BasicSourceMapConsumer = (await new SourceMapConsumer(
      readFileSync(
        join(homedir(), this.configService.get('SOURCE_MAP_PATH')),
        'utf-8',
      ),
    )) as BasicSourceMapConsumer

    const lines: string[] = errorMsg.stack.split(/\n\r?/)
    const compressions: IError[] = []
    const sources: IError[] = []
    for (const line of lines) {
      let columnNo: number = 0
      let lineNo: number = 0
      let pow: number = 0
      let isDelimiter = false
      for (let i = line.length - 1; i >= 0; i--) {
        if (/\d/.test(line[i]) && !isDelimiter) {
          columnNo = Number(line[i]) * 10 ** pow + columnNo
          pow++
        } else if (/\d/.test(line[i]) && isDelimiter) {
          lineNo = Number(line[i]) * 10 ** pow + lineNo
          pow++
        } else if (line[i] === ':' && !lineNo) {
          isDelimiter = true
          pow = 0
        } else if (line[i] === ':') {
          break
        }
      }
      if (!lineNo || !columnNo) continue
      const currentPos: NullableMappedPosition = consumer.originalPositionFor({
        line: lineNo,
        column: columnNo,
      })
      const sourceContent: string = consumer.sourceContentFor(currentPos.source)
      const sourceLines = sourceContent.split(/\n\r?/)
      const sourceLine =
        sourceLines.find((_, i) => i == currentPos.line - 1) ?? ''
      compressions.push({
        line: lineNo,
        column: columnNo,
        source: line.trim(),
      })
      sources.push({
        ...currentPos,
        text: sourceLine.trim(),
      })
    }
    const errorDto: CreateErrorDto = {
      sources,
      compressions,
      stackMsg: errorMsg.stack,
      message: errorMsg.message,
    }
    const createError = new this.errorModel(errorDto)
    return createError.save()
  }
}
