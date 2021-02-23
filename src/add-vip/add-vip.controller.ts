import {
  Controller,
  Post,
  Body,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AddVipService } from './add-vip.service'
import { File } from '../common/interface/common.interface'

@Controller('img')
export class AddVipController {
  constructor(private readonly vipService: AddVipService) {}

  @Post('/add-vip')
  @UseInterceptors(FileInterceptor('file'))
  async addVip(@UploadedFile() file: File, @Body() data, @Request() req) {
    const img = await req.transformFileToImg(file.buffer)
    return this.vipService.addVip({
      file,
      img,
      ...data,
    })
  }
}
