import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  DefaultValuePipe,
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
    @Body('size', new DefaultValuePipe(100), ParseIntPipe) size,
    @Body('borderRadius', new DefaultValuePipe(10), ParseIntPipe) borderRadius,
    @Body('radius', new DefaultValuePipe(50), ParseIntPipe) radius,
    @Body('round', ParseIntPipe) round,
  ): Promise<HttpResponse> {
    return this.vipService.addVip({
      file,
      ...data,
      size,
      radius,
      round,
      borderRadius,
    })
  }

  @Get('/fetch-vips')
  async fetchVipImgs(): Promise<HttpResponse> {
    return this.vipService.fetchVipImgs()
  }
}
