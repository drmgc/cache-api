import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { schemas } from './schemas'
import { CacheProvidingService } from './cache-providing.service'
import { CacheService } from './cache.service'
import { CacheController } from './cache.controller'

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature(schemas),
  ],
  controllers: [CacheController],
  providers: [
    CacheProvidingService,
    CacheService,
  ],
  exports: [
    CacheService,
  ],
})
export class CacheModule { }
