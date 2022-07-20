import { IsOptional, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

import {
  ApiTags,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'

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

@ApiTags('cache')
@Controller('cache')
export class CacheController {
  constructor(
    private readonly cacheService: CacheService,
  ) {}

  @ApiOperation({
    summary: 'Get all stored keys',
  })
  @Get()
  findAll(
    @Query() { skip, limit, includeExpired }: FindAllQuery,
  ): Promise<string[]> {
    return this.cacheService.findAllKeys({ skip, limit, includeExpired })
  }

  @ApiOperation({
    summary: 'Delete all stored keys',
  })
  @Delete()
  deleteAll(): Promise<void> {
    return this.cacheService.removeAllKeys()
  }

  @ApiOperation({
    summary: 'Get the cached data for a given key',
    description: 'If there is no such key, it will be retrived',
  })
  @ApiParam({ name: 'key', type: 'string' })
  @Get(':key')
  findByKey(
    @Param('key') key: string,
  ): Promise<string> {
    return this.cacheService.getKey(key)
  }

  @ApiOperation({
    summary: 'Refresh and get data for a given key',
  })
  @ApiParam({ name: 'key', type: 'string' })
  @Post(':key')
  refreshKey(
    @Param('key') key: string,
  ): Promise<string> {
    return this.cacheService.refreshKey(key)
  }

  @ApiOperation({
    summary: 'Delete given key',
  })
  @ApiParam({ name: 'key', type: 'string' })
  @Delete(':key')
  deleteByKey(
    @Param('key') key: string,
  ): Promise<void> {
    return this.cacheService.removeKey(key)
  }
}
