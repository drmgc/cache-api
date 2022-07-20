import { ModelDefinition } from '@nestjs/mongoose'

export * from './cache.schema'

import { Cache, CacheSchema } from './cache.schema'

export const schemas: ModelDefinition[] = [
  { name: Cache.name, schema: CacheSchema },
]
