import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { CacheModule } from './cache'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: async (config: ConfigService) => {
        return {
          uri: config.get<string>('MONGODB_URI', 'mongodb://localhost/cache-api'),
        }
      },
    }),
    CacheModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
