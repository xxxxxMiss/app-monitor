import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as bodyParser from 'body-parser'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  const config = new DocumentBuilder()
    .setTitle('Image Operation Example')
    .setDescription('The Image Operation Api Description')
    .setVersion('1.0')
    .addTag('image')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
  app.enableCors()
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )
  await app.listen(3000)
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
