import ICacheDTO from '../dtos/ICacheDTO';

export default interface ICacheProvider {
  save(data: ICacheDTO): Promise<void>;
  recover<T>(key: string): Promise<T | undefined>;
  invalidate(key: string): Promise<void>;
  invalidatePrefix(prefix: string): Promise<void>;
}
