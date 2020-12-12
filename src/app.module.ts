import {
  Module,
  RequestMethod,
  NestModule,
  MiddlewareConsumer,
  DynamicModule,
} from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CatsController } from './cats/cats.controller'
import { CatsService } from './cats/cats.service'
import { CatsModule } from './cats/cats.module'
import { LoggerMiddleware } from './common/middleware/logger.middleware'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ErrorController } from './error/error.controller'
import { ErrorService } from './error/error.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Cat, CatSchema } from './cats/schemas/cat.schema'
import { Error, ErrorSchema } from './error/schemas/error.schema'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CatsModule,
    MongooseModule.forRoot('mongodb://localhost/dfgroup-monitor'),
    MongooseModule.forFeatureAsync([
      {
        name: Cat.name,
        useFactory: (configService: ConfigService) => {
          const schema = CatSchema
          schema.pre('save', () => {
            console.log('pre from hello world', configService.get('PREFIX'))
          })
          return schema
        },
        // inject: [ConfigService]
      },
      {
        name: Error.name,
        useFactory: () => {
          return ErrorSchema
        },
      },
    ]),
  ],
  controllers: [AppController, CatsController, ErrorController],
  providers: [AppService, CatsService, ErrorService, ConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: 'cats',
      method: RequestMethod.GET,
    })
  }
  static forRoot(entities = [], options?): DynamicModule {
    console.log('=======', entities, options) //   return { module: AppModule }
    return
  }
}
