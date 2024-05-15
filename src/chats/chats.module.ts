import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Chat } from "./chat.model";
import { ChatService } from "./chat.service";

@Module({
  imports: [SequelizeModule.forFeature([Chat])],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
