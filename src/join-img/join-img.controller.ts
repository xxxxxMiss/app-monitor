import {
  Controller,
  Body,
  Post,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { JoinImgService } from './join-img.service'
import { File } from '../common/interface/common.interface'

@Controller('img')
export class JoinImgController {
  constructor(private readonly joinImgService: JoinImgService) {}

  @Post('join')
  @UseInterceptors(FilesInterceptor('files[]'))
  async join(@UploadedFiles() files: File[], @Body() body) {
    return this.joinImgService.join({
      files,
      ...body,
    })
  }
}
