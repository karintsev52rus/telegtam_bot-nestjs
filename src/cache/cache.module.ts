import { Module } from "@nestjs/common";
import { CacheModule as NestJsCacheModule } from "@nestjs/cache-manager";
import { CacheService } from "./cache.service";
import { RedisOptions } from "src/configs/redisConfig";
import { CacheRepository } from "./cache.repository";

@Module({
  imports: [NestJsCacheModule.registerAsync(RedisOptions)],
  providers: [CacheService, CacheRepository],
  exports: [CacheService, CacheRepository],
})
export class CacheModule {}
