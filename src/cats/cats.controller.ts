import {
  Controller,
  Param,
  ParseIntPipe,
  Get,
  Req,
  Body,
  Post,
  UsePipes,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { Request } from 'express'
import { CreateCatDto } from './dto/create-cat.dto'
import { CatsService } from './cats.service'
import { Cat } from './interfaces/cat.interface'
import { ValidationPipe } from '../common/pipe/validation.pipe'
import { AuthGuard } from '../common/auth.guard'
import { RecognizeData } from './interfaces/fund.interface'
import { FileInterceptor } from '@nestjs/platform-express'
import { Buffer } from 'buffer'

@Controller('cats')
@UseGuards(AuthGuard)
export class CatsController {
  constructor(private catsServiece: CatsService) {}

  @Post()
  async create(@Body(new ValidationPipe()) createCatDao: CreateCatDto) {
    this.catsServiece.create(createCatDao)
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsServiece.findAll()
  }

  @Post('/fund-recognize')
  async getData(@Req() req: Request): Promise<RecognizeData> {
    const msgs: Buffer[] = []
    return new Promise((resovle) => {
      req.on('data', (data) => {
        msgs.push(data)
      })
      req.on('end', () => {
        const buf = Buffer.concat(msgs)
        resovle(this.catsServiece.resolve(buf))
      })
    })
  }

  // @Get('/test')
  @Post('/test')
  @UseInterceptors(FileInterceptor('file'))
  async test(@UploadedFile() file): Promise<RecognizeData> {
    console.log('-------file: ', file)
    return this.catsServiece.test()
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): string {
    return this.catsServiece.findOne(id)
  }
}
