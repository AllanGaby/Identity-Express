import ICacheDTO from '../dtos/ICacheDTO';
import ICacheProvider from '../models/ICacheProvider';

interface ICacheData {
  [key: string]: string;
}

export default class FakeCacheProvider implements ICacheProvider {
  private cache: ICacheData = {};

  public async save({ key, value }: ICacheDTO): Promise<void> {
    this.cache[key] = JSON.stringify(value);
  }

  public async recover<T>(key: string): Promise<T | undefined> {
    const value = this.cache[key];
    if (!value) {
      return undefined;
    }
    const parsedValue = JSON.parse(value);
    return parsedValue as T;
  }

  public async invalidate(key: string): Promise<void> {
    delete this.cache[key];
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = Object.keys(this.cache).filter(key =>
      key.startsWith(`${prefix}:`),
    );

    keys.forEach(key => {
      delete this.cache[key];
    });
  }
}
