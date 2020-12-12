import {
  Module,
  RequestMethod,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CatsModule } from './cats/cats.module'
import { LoggerMiddleware } from './common/middleware/logger.middleware'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose'
import { ErrorModule } from './error/error.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CatsModule,
    ErrorModule,
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService): MongooseModuleOptions => {
        return {
          uri: configService.get('MONGODB_URI'),
        }
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: 'cats',
      method: RequestMethod.GET,
    })
  }
}
