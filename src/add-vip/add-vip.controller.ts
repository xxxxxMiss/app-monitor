import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AddVipService } from './add-vip.service'
import { File, HttpResponse } from '../common/interface/common.interface'

@Controller('img')
export class AddVipController {
  constructor(private readonly vipService: AddVipService) {}

  @Post('/add-vip')
  @UseInterceptors(FileInterceptor('file'))
  async addVip(
    @UploadedFile() file: File,
    @Body() data,
  ): Promise<HttpResponse> {
    return this.vipService.addVip({
      file,
      ...data,
    })
  }

  @Get('/fetch-vips')
  async fetchVipImgs(): Promise<HttpResponse> {
    return this.vipService.fetchVipImgs()
  }
}
