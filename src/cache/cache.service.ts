import { Inject, Injectable } from "@nestjs/common";
import { CacheRepository } from "./cache.repository";

@Injectable()
export class CacheService {
  constructor(
    @Inject(CacheRepository) private readonly cacheRepository: CacheRepository
  ) {}

  async getData<dataType>(dataKey: string): Promise<dataType | null> {
    const jsonData = await this.cacheRepository.get(dataKey);
    return JSON.parse(jsonData);
  }

  async saveData(dataKey: string, dataValue: any): Promise<void> {
    const jsonData = JSON.stringify(dataValue);
    await this.cacheRepository.set(dataKey, jsonData);
  }

  async cleanData(dataKey: string): Promise<void> {
    await this.cacheRepository.delete(dataKey);
  }
}
