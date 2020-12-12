import { Module } from '@nestjs/common'
import { CatsController } from './cats.controller'
import { CatsService } from './cats.service'
import { Cat, CatSchema } from './schemas/cat.schema'
import { MongooseModule } from '@nestjs/mongoose'
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
  imports: [MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])],
})
export class CatsModule {}
