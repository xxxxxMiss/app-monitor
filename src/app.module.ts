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
import { TransformFileMiddleware } from './common/middleware/transform-file.middleware'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose'
import { ErrorModule } from './error/error.module'
import { MailService } from './mail/mail.service'
import config from './config/configuration'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { WatermarkController } from './watermark/watermark.controller'
import { WatermarkService } from './watermark/watermark.service'
import { JoinImgController } from './join-img/join-img.controller'
import { JoinImgService } from './join-img/join-img.service'

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
  controllers: [AppController, WatermarkController, JoinImgController],
  providers: [
    AppService,
    ConfigService,
    MailService,
    WatermarkService,
    JoinImgService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: 'cats',
      method: RequestMethod.GET,
    })
    consumer.apply(TransformFileMiddleware).forRoutes('img')
  }
}
