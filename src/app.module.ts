import { Module } from "@nestjs/common";
import { TelegramBotModule } from "./telegram-bot/telegram-bot.module";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { Channel } from "./channels/channel.model";
import { ChannelModule } from "./channels/channel.module";
import { Chat } from "./chats/chat.model";
import { ChatModule } from "./chats/chats.module";
import { CacheModule } from "./cache/cache.module";

@Module({
  imports: [
    TelegramBotModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      models: [Channel, Chat],
      define: { underscored: true },
      autoLoadModels: true,
      sync: { alter: true },
    }),
    CacheModule,
    ChannelModule,
    ChatModule,
  ],
})
export class AppModule {}
