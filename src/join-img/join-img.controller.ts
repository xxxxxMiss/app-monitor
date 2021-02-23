import {
  Controller,
  Body,
  Post,
  Request,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { JoinImgService } from './join-img.service'
import { File } from '../common/interface/common.interface'
import { Image } from 'canvas'

@Controller('img')
export class JoinImgController {
  constructor(private readonly joinImgService: JoinImgService) {}

  @Post('join')
  @UseInterceptors(FilesInterceptor('files[]'))
  async join(@UploadedFiles() files: File[], @Body() body, @Request() req) {
    const imgs: Image[] = await Promise.all(
      files.map(file => req.transformFileToImg(file.buffer)),
    )
    return this.joinImgService.join({
      files,
      imgs,
      ...body,
    })
  }
}
