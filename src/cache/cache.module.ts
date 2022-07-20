import { Module } from '@nestjs/common'

import { CacheController } from './cache.controller'
import { CacheProvidingService } from './cache-providing.service'
import { CacheService } from './cache.service'

@Module({
  imports: [],
  controllers: [CacheController],
  providers: [
    CacheProvidingService,
    CacheService,
  ],
})
export class CacheModule { }
