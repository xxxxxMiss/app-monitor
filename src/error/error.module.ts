import { Module } from '@nestjs/common'
import { ErrorController } from './error.controller'
import { ErrorService } from './error.service'
import { MongooseModule } from '@nestjs/mongoose'
import { ErrorSchema, Error } from './schemas/error.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Error.name,
        schema: ErrorSchema,
      },
    ]),
  ],
  controllers: [ErrorController],
  providers: [ErrorService],
})
export class ErrorModule {}
