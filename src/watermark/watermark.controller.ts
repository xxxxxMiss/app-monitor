import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { WatermarkService } from './watermark.service'
import { ValidationPipe } from '../common/pipe/validation.pipe'
import { AddWatermarkDto } from './dto/watermark.dto'
@Controller('img')
export class WatermarkController {
  constructor(private readonly watermarkService: WatermarkService) {}
  @Post('/add-watermark')
  @UseInterceptors(FileInterceptor('file'))
  async addWatermark(
    @UploadedFile() file,
    @Body(new ValidationPipe()) body: AddWatermarkDto,
  ) {
    return this.watermarkService.addWatermark({
      file,
      ...body,
    })
  }
}
