import { SequelizeModule } from "@nestjs/sequelize";
import { Channel } from "./channel.model";
import { Module } from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { ChatModule } from "src/chats/chats.module";

@Module({
  imports: [SequelizeModule.forFeature([Channel]), ChatModule],
  providers: [ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
