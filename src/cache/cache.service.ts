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
  private readonly capacity: number
  private readonly cleanupGap: number

  constructor(
    config: ConfigService,
    private readonly cacheProvider: CacheProvidingService,
    @InjectModel(Cache.name) private readonly cacheModel: Model<CacheDocument>,
  ) {
    this.ttl = ms(config.get<string>('CACHE_TTL', '60s'))
    this.capacity = config.get<number>('CACHE_CAPACITY', 10)
    this.cleanupGap = config.get<number>('CACHE_CLEANUP_GAP', 5)

    this.logger.log(`TTL set to ${ms(this.ttl, { long: true })}`)
    this.logger.log(`Capacity set to ${this.capacity}`)
    this.logger.log(`Cleanup gap set to ${this.cleanupGap}`)
  }

  get cleanupAt(): number {
    return this.capacity - this.cleanupGap
  }

  async findAllKeys(
    { skip, limit, includeExpired }: { skip?: number, limit?: number, includeExpired?: boolean },
  ): Promise<CacheKey[]> {
    const caches = await this.cacheModel
      .find(
        !includeExpired && {
          expiresAt: { $gt: new Date() },
        } || {}
      )
      .sort('+expiresAt')
      .skip(skip || 0)
      .limit(limit || 10)
      .select({ key: 1 })

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

    // Check for cleanup capacity
    const count = await this.cacheModel.count()
    if (count > this.cleanupAt) await this.cleanup()

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

  async cleanup(): Promise<void> {
    await this.cleanupExpired()

    const count = await this.cacheModel.count()
    if (count > this.cleanupAt) await this.cleanupOldest()
  }

  private async cleanupExpired(): Promise<void> {
    await this.cacheModel.deleteMany({
      expiresAt: { $lt: new Date() },
    })
  }

  private async cleanupOldest(): Promise<void> {
    // Looking up for newest of top-[cleanupGap] oldest items
    const oldest = await this.cacheModel
      .find({})
      .sort('+expiresAt')
      .skip(this.cleanupGap)
      .limit(1)
      .select({ expiresAt: 1 })

    const cleanupPoint = oldest[oldest.length - 1]!.expiresAt

    // Delete all cache items older then the news of oldest
    await this.cacheModel.deleteMany({
      expiresAt: { $le: cleanupPoint },
    })
  }
}
