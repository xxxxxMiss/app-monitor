import {
  Controller,
  Post,
  Res,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common'
import { TransformService } from './transform.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import Jimp from 'jimp'

@Controller('img')
export class TransformController {
  constructor(private readonly transformService: TransformService) {}

  @Post('/transform-img')
  @UseInterceptors(FileInterceptor('file'))
  async test(@UploadedFile() file, @Res() res: Response) {
    const jimpObj: Jimp = await this.transformService.test({ file })
    res.set('Content-Type', 'image/jpeg')
    // res.send(jimpObj.bitmap.data)
    res.json({
      code: 0,
      data: await jimpObj.getBase64Async(jimpObj.getMIME()),
    })
  }
  @Post('/transform-pdf')
  @UseInterceptors(FileInterceptor('file'))
  async pdf2Img(@UploadedFile() file, @Res() res: Response) {
    const img = await this.transformService.pdf2Img({ file })
    res.set('Content-Type', 'image/jpeg')
    res.json({
      code: 0,
      data: img,
    })
  }
  @Post('/transform/markdown-pdf')
  async markdown2Pdf(@Body('text') data) {
    return await this.transformService.markdown2Pdf({
      data,
      filename: 'x.pdf',
      type: 'pdf',
      emoji_f: true,
    })
  }
}
