import Redis, { Redis as RedisClient } from 'ioredis';
import CacheConfig from '@config/cache';
import ICacheDTO from '../dtos/ICacheDTO';
import ICacheProvider from '../models/ICacheProvider';

export default class FakeCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(CacheConfig.config.redis);
  }

  public async save({ key, value }: ICacheDTO): Promise<void> {
    this.client.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | undefined> {
    const value = await this.client.get(key);
    if (!value) {
      return undefined;
    }
    const parsedValue = JSON.parse(value);
    return parsedValue as T;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`);
    const pipeline = this.client.pipeline();

    keys.forEach(key => {
      pipeline.del(key);
    });
    await pipeline.exec();
  }
}
