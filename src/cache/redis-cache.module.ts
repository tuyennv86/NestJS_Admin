import { RedisCacheService } from './redis-cache.service';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                store: redisStore,
                host: configService.get('REDIS_HOST'),
                port: configService.get('REDIS_PORT'),
                ttl: configService.get('CACHE_TTL'),
                max: configService.get('MAX_ITEM_IN_CACHE')
            })
        })
    ],
    // controllers: [],
    providers: [
        RedisCacheService],
    exports: [RedisCacheService]
})
export class RedisCacheModule { }
