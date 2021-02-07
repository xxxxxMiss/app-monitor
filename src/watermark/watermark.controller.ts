import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { WatermarkService } from './watermark.service'

@Controller('watermark')
export class WatermarkController {
  constructor(private readonly watermarkService: WatermarkService) {}
  @Post('/add')
  @UseInterceptors(FileInterceptor('file'))
  async addWatermark(@UploadedFile() file, @Body() body) {
    return this.watermarkService.addWatermark({
      file,
      ...body,
    })
  }
}
