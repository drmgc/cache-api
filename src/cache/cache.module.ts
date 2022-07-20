import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CacheController } from './cache.controller'
import { schemas } from './schemas'
import { CacheProvidingService } from './cache-providing.service'
import { CacheService } from './cache.service'

@Module({
  imports: [
    MongooseModule.forFeature(schemas),
  ],
  controllers: [CacheController],
  providers: [
    CacheProvidingService,
    CacheService,
  ],
})
export class CacheModule { }
