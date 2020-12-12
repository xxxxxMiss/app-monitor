import { Controller } from '@nestjs/common'
import { ErrorService } from './error.service'
import { Post, Body } from '@nestjs/common'
import { IErrorMsg } from './interfaces/error.interface'

@Controller('error')
export class ErrorController {
  constructor(private errorService: ErrorService) {}

  @Post('/report')
  async resolve(@Body() errorMsg: IErrorMsg) {
    return this.errorService.resolve(errorMsg)
  }
}
