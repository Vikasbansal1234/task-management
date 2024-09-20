import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from '@app/redis/redis.service';
import Redis from 'ioredis';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: 'REDIS',
            useFactory: async (configService: ConfigService) => {
                const host = configService.get<string>('redis.host');
                const port = configService.get<number>('redis.port');
                const password = configService.get<string>('redis.password');
                const username = configService.get<string>('redis.username') || 'default'; // Use 'default' if no username provided

                // Construct the Redis URL
                const redisUrl = `rediss://${username}:${password}@${host}:${port}`;

                return new Redis({
                    host, port
                });
            },
            inject: [ConfigService],
        },
        RedisService,
    ],
    exports: [RedisService],
})
export class RedisModule { }
