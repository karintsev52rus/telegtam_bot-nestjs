import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Chat } from "./chat.model";
import { ChatDTO } from "./chat.dto";

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat) public chatModel: typeof Chat) {}

  addChat = async (chatDTO: ChatDTO) => {
    const { chatId, username, userId, date } = chatDTO;
    try {
      const isChatExsists = await this.chatModel.findOne({
        where: { chatId },
      });
      if (isChatExsists) {
        await this.chatModel.update(
          { date, username, userId },
          { where: { chatId } }
        );
      } else {
        await this.chatModel.create({
          chatId,
          username,
          userId,
          date,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
}
