import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { AppModule } from './app.module'

async function bootstrap() {
  const logger = new Logger('main')

  const app = await NestFactory.create(AppModule)

  const config = app.get(ConfigService)
  const port = config.get<number>('PORT', 3000)

  await app.listen(port)

  logger.log(`Listening on port ${port}`)
}
bootstrap()
