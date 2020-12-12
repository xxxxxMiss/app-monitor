import { Controller } from '@nestjs/common'
import { ErrorService } from './error.service'
import { Post, Body } from '@nestjs/common'
import { ErrorMsg } from './interfaces/error.interface'

@Controller('error')
export class ErrorController {
  constructor(private errorService: ErrorService) {}

  @Post('/report')
  async resolve(@Body() errorMsg: ErrorMsg) {
    return this.errorService.resolve(errorMsg)
  }
}
