import { Inject, Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS') private readonly redisClient: Redis.Redis,
  ) {}

  async set(key: string, value: any, expireTimeInSeconds?: number): Promise<void> {
    if (expireTimeInSeconds) {
      await this.redisClient.set(key, JSON.stringify(value), 'EX', expireTimeInSeconds);
    } else {
      await this.redisClient.set(key, JSON.stringify(value));
    }
  }

  async get(key: string): Promise<any> {
    const value = await this.redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  // Bulk insert using MSET
  async bulkInsert(keys: { key: string, value: string }[]): Promise<void> {
    const data = keys.reduce((acc, { key, value }) => {
      acc.push(key, value);
      return acc;
    }, []);
    await this.redisClient.mset(...data);
  }

  // Bulk delete
  async bulkDelete(keys: string[]): Promise<void> {
    const pipeline = this.redisClient.pipeline();
    keys.forEach((key) => {
      pipeline.del(key);
    });
    await pipeline.exec();
  }
}
