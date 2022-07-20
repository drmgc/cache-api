import { IsOptional, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

import {
  Controller,
  Get, Delete, Post,
  Param, Query,
} from '@nestjs/common'
import { CacheService } from './cache.service'

export class FindAllQuery {
  @IsOptional()
  @IsNumber()
  skip?: number

  @IsOptional()
  @IsNumber()
  limit?: number

  @IsOptional()
  @Type(() => Number)
  includeExpired?: boolean
}

@Controller('cache')
export class CacheController {
  constructor(
    private readonly cacheService: CacheService,
  ) {}

  @Get()
  findAll(
    @Query() { skip, limit, includeExpired }: FindAllQuery,
  ): Promise<string[]> {
    return this.cacheService.findAllKeys({ skip, limit, includeExpired })
  }

  @Delete()
  deleteAll(): Promise<void> {
    return this.cacheService.removeAllKeys()
  }

  @Get(':key')
  findByKey(
    @Param('key') key: string,
  ): Promise<string> {
    return this.cacheService.getKey(key)
  }

  @Post(':key')
  refreshKey(
    @Param('key') key: string,
  ): Promise<string> {
    return this.cacheService.refreshKey(key)
  }

  @Delete(':key')
  deleteByKey(
    @Param('key') key: string,
  ): Promise<void> {
    return this.cacheService.removeKey(key)
  }
}
