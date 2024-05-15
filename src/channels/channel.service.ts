import { Injectable } from "@nestjs/common";
import { Channel } from "./channel.model";
import { ChannelDTO } from "./channel.dto";
import { InjectModel } from "@nestjs/sequelize";
import { ChatService } from "src/chats/chat.service";

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(Channel) public channelModel: typeof Channel,
    public chatService: ChatService
  ) {}

  async findAll(): Promise<Channel[]> {
    return this.channelModel.findAll();
  }

  async addOne(channelDTO: ChannelDTO): Promise<Channel> {
    const { channelId, title, username } = channelDTO;
    return this.channelModel.create({
      channelId,
      title,
      username,
    });
  }

  async getChannelIds(): Promise<number[]> {
    const allChannels = await this.findAll();
    if (allChannels.length) {
      const channelIds = allChannels.map((chat) => {
        return chat.channelId;
      });
      return channelIds;
    } else return [];
  }
}
