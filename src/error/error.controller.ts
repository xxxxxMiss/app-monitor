import { Controller, Post, Body } from '@nestjs/common'
import { ErrorService } from './error.service'
import { IErrorMsg } from './interfaces/error.interface'

@Controller('error')
export class ErrorController {
  constructor(private errorService: ErrorService) {}

  @Post('/report')
  async resolve(@Body() errorMsg: IErrorMsg) {
    return this.errorService.resolve(errorMsg)
  }

  @Post('/save-sourcemap')
  async saveSourcemap(@Body() body) {
    console.log(body)
    return this.errorService.saveSourcemap(body)
  }
}
