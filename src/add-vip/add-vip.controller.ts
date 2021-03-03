import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AddVipService } from './add-vip.service'
import { File, HttpResponse } from '../common/interface/common.interface'
import { AddVipEntity } from './entities/add-vip.entity'
import { FetchVips } from './entities/fetch-vips.entity'
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger'
import { Response } from 'express'
import { Readable } from 'stream'

@Controller('img')
export class AddVipController {
  constructor(private readonly vipService: AddVipService) {}

  @Post('/add-vip')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Add a vip flag to a image',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiBody({
    type: AddVipEntity,
  })
  @ApiConsumes('multipart/form-data')
  async addVip(
    @UploadedFile() file: File,
    @Body() data: AddVipEntity,
    @Res() res: Response,
  ) {
    const result: Readable | HttpResponse = await this.vipService.addVip({
      file,
      ...data,
    })
    if (result instanceof Readable) {
      // @ts-ignore
      res.set('Content-Type', result.mimeType)
      result.pipe(res)
    } else {
      res.json(result)
    }
  }

  @ApiResponse({
    status: 200,
    description: 'Get default vip images',
    type: FetchVips,
  })
  @Get('/fetch-vips')
  async fetchVipImgs(): Promise<HttpResponse> {
    return this.vipService.fetchVipImgs()
  }
}
