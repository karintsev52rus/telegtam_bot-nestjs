import { Module } from "@nestjs/common";
import { TelegramBotService } from "./telegram-bot.service";
import { ChannelModule } from "src/channels/channel.module";
import { ChatModule } from "src/chats/chats.module";

@Module({
  providers: [TelegramBotService],
  imports: [ChannelModule, ChatModule],
})
export class TelegramBotModule {}
