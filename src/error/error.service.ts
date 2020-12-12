import { Injectable } from '@nestjs/common'
import { readFileSync } from 'fs'
import { join, parse } from 'path'
import {
  SourceMapConsumer,
  BasicSourceMapConsumer,
  NullableMappedPosition,
} from 'source-map'
import { ErrorMsg } from './interfaces/error.interface'
import { homedir } from 'os'

@Injectable()
export class ErrorService {
  async resolve(errorMsg: ErrorMsg) {
    const consumer: BasicSourceMapConsumer = (await new SourceMapConsumer(
      readFileSync(
        join(homedir(), 'workspace/egg-react-umi/app/public/umi.js.map'),
        'utf-8',
      ),
    )) as BasicSourceMapConsumer

    const lines: string[] = errorMsg.stack.split(/\n\r?/)
    const sourceStack: string[] = [errorMsg.message]
    for (const line of lines) {
      let columnNo: string = ''
      let lineNo: string = ''
      let isDelimiter = false
      for (let i = line.length - 1; i >= 0; i--) {
        if (/\d/.test(line[i]) && !isDelimiter) {
          columnNo = line[i] + columnNo
        } else if (/\d/.test(line[i]) && isDelimiter) {
          lineNo = line[i] + lineNo
        } else if (line[i] === ':' && !lineNo) {
          isDelimiter = true
        } else if (line[i] === ':') {
          break
        }
      }
      if (!lineNo || !columnNo) continue
      const currentPos: NullableMappedPosition = consumer.originalPositionFor({
        line: Number(lineNo),
        column: Number(columnNo),
      })
      const sourceContent: string = consumer.sourceContentFor(currentPos.source)
      const sourceLines = sourceContent.split(/\n\r?/)
      const sourceLine = sourceLines.find((_, i) => i == currentPos.line - 1)
      sourceStack.push(
        `at ${currentPos.name} (${currentPos.source}:${currentPos.line}:${currentPos.column})`,
      )
    }
    console.log(sourceStack.join('\n'))
  }
}
