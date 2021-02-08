import {
  Controller,
  Body,
  Post,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { JoinImgService } from './join-img.service'
import { JoinImg } from './interfaces/join-img.interface'

@Controller('img')
export class JoinImgController {
  constructor(private readonly joinImgService: JoinImgService) {}

  @Post('join')
  @UseInterceptors(FilesInterceptor('files[]'))
  join(@UploadedFiles() files, @Body() body) {}
}
