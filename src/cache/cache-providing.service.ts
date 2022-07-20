import crypto from 'crypto'

import { Injectable } from '@nestjs/common'

import { CacheKey, CacheValue } from './types'

/**
  A service for providing reference data for cache
 */
@Injectable()
export class CacheProvidingService {
  constructor() { }

  async get(key: CacheKey): Promise<CacheValue> {
    return crypto.randomBytes(20).toString('hex')
  }
}
