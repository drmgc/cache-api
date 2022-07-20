import { Model } from 'mongoose'
import ms from 'ms'

import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'

import { Cache, CacheDocument } from './schemas'

import { CacheKey, CacheValue } from './types'

import { CacheProvidingService } from './cache-providing.service'

@Injectable()
export class CacheService {
  private readonly logger: Logger = new Logger(CacheService.name)

  private readonly ttl: number

  constructor(
    config: ConfigService,
    private readonly cacheProvider: CacheProvidingService,
    @InjectModel(Cache.name) private readonly cacheModel: Model<CacheDocument>,
  ) {
    this.ttl = ms(config.get<string>('CACHE_TTL', '10s'))

    this.logger.log(`TTL set to ${ms(this.ttl, { long: true })}`)
  }

  async lookupKey(key: CacheKey): Promise<CacheValue> {
    const now = new Date()

    const cache = await this.cacheModel.findOne({ key })

    if (cache && cache.expiresAt > now) return cache.value

    return await this.refreshKey(key)
  }

  private async refreshKey(key: CacheKey): Promise<CacheValue> {
    const value = this.cacheProvider.get(key)

    const expiresAt = new Date(new Date().getTime() + this.ttl)

    const newCache = await this.cacheModel.findOneAndUpdate(
      { key },
      { value, expiresAt },
      { upsert: true, new: true },
    )

    return newCache.value
  }
}
