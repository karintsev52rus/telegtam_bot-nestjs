import { SequelizeModule } from "@nestjs/sequelize";
import { Channel } from "./channel.model";
import { Module } from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { CacheModule } from "../cache/cache.module";

@Module({
  imports: [SequelizeModule.forFeature([Channel]), CacheModule],
  providers: [ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
