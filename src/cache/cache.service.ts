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

  async findAllKeys(
    { skip, limit }: { skip?: number, limit?: number },
  ): Promise<CacheKey[]> {
    const caches = await this.cacheModel
      .find({ expiresAt: { $lt: new Date() } })
      .select({ key: 1 })
      .skip(skip || 0)
      .limit(limit || 10)

    return caches.map(c => c.key)
  }

  async getKey(key: CacheKey): Promise<CacheValue> {
    const now = new Date()

    const cache = await this.cacheModel.findOne({ key })

    if (cache && cache.expiresAt > now) return cache.value

    return await this.refreshKey(key)
  }

  async refreshKey(key: CacheKey): Promise<CacheValue> {
    const value = await this.cacheProvider.get(key)

    await this.setKey(key, value)

    return value
  }

  async setKey(key: CacheKey, value: CacheValue): Promise<void> {
    const expiresAt = new Date(new Date().getTime() + this.ttl)

    // TODO: check count of cache items

    await this.cacheModel.findOneAndUpdate(
      { key },
      { value, expiresAt },
      { upsert: true, new: true },
    )
  }

  async removeKey(key: CacheKey): Promise<void> {
    await this.cacheModel.findOneAndDelete({ key })
  }

  async removeAllKeys(): Promise<void> {
    await this.cacheModel.remove({})
  }
}
