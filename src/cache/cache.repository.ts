import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";

@Injectable()
export class CacheRepository {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get(key: string): Promise<string | null> {
    return this.cacheManager.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.cacheManager.set(key, value);
  }

  async delete(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
