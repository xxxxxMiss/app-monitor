import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { WatermarkService } from './watermark.service'

@Controller('img')
export class WatermarkController {
  constructor(private readonly watermarkService: WatermarkService) {}
  @Post('/add-watermark')
  @UseInterceptors(FileInterceptor('file'))
  // TODO: use pipe to transform buffer to image
  async addWatermark(@UploadedFile() file, @Body() body) {
    return this.watermarkService.addWatermark({
      file,
      ...body,
    })
  }
}
