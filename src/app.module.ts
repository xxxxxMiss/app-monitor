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
import { MailService } from './mail/mail.service'
import config from './config/configuration'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      ignoreEnvFile: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api/*'],
    }),
    CatsModule,
    ErrorModule,
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService): MongooseModuleOptions => {
        return {
          uri: configService.get('mongodb_uri'),
        }
      },
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService, MailService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: 'cats',
      method: RequestMethod.GET,
    })
  }
}
