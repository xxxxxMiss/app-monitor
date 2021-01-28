import { Module } from '@nestjs/common'
import { CatsController } from './cats.controller'
import { CatsService } from './cats.service'
import { Cat, CatSchema } from './schemas/cat.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { MailService } from '../mail/mail.service'
@Module({
  controllers: [CatsController],
  providers: [CatsService, MailService],
  exports: [CatsService],
  imports: [MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])],
})
export class CatsModule {}
