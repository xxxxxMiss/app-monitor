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
} from '@nestjs/common'
import { Request } from 'express'
import { CreateCatDto } from './dto/create-cat.dto'
import { CatsService } from './cats.service'
import { Cat } from './interfaces/cat.interface'
import { ValidationPipe } from '../common/pipe/validation.pipe'
import { AuthGuard } from '../common/auth.guard'
import { RecognizeData } from './interfaces/fund.interface'

@Controller('cats')
@UseGuards(AuthGuard)
export class CatsController {
  constructor(private catsServiece: CatsService) {}
  @Get()
  miao(@Req() request: Request): string {
    return 'miao' + JSON.stringify(request.query)
  }

  @Post()
  async create(@Body(new ValidationPipe()) createCatDao: CreateCatDto) {
    this.catsServiece.create(createCatDao)
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsServiece.findAll()
  }

  @Post('/fund-recognize')
  async getData(@Body() imgBuf: Buffer): Promise<RecognizeData> {
    return this.catsServiece.resolve(imgBuf)
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): string {
    return this.catsServiece.findOne(id)
  }
}
