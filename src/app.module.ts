import {
  Module,
  RequestMethod,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CatsController } from './cats/cats.controller'
import { CatsService } from './cats/cats.service'
import { CatsModule } from './cats/cats.module'
import { LoggerMiddleware } from './common/middleware/logger.middleware'
import { ConfigModule } from '@nestjs/config'
import { ErrorController } from './error/error.controller'
import { ErrorService } from './error/error.service'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CatsModule],
  controllers: [AppController, CatsController, ErrorController],
  providers: [AppService, CatsService, ErrorService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: 'cats',
      method: RequestMethod.GET,
    })
  }
}
