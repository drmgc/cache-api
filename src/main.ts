import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { AppModule } from './app.module'

async function bootstrap() {
  const logger = new Logger('main')

  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  const docConfig = new DocumentBuilder()
    .setTitle('Cache API')
    .setVersion('0.0.1')
    .build()

  const document = SwaggerModule.createDocument(app, docConfig)
  SwaggerModule.setup('docs', app, document)

  const config = app.get(ConfigService)
  const port = config.get<number>('PORT', 3000)

  await app.listen(port)

  logger.log(`Listening on port ${port}`)
}
bootstrap()
