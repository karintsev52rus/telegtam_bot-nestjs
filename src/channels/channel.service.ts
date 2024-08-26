import { Inject, Injectable } from "@nestjs/common";
import { Channel } from "./channel.model";
import { ChannelDTO } from "./channel.dto";
import { InjectModel } from "@nestjs/sequelize";
import { CacheService } from "src/cache/cache.service";

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(Channel) private readonly channelModel: typeof Channel,
    @Inject(CacheService) private readonly cacheService: CacheService
  ) {}

  async findAll(): Promise<Channel[]> {
    return this.channelModel.findAll();
  }

  async addOne(channelDTO: ChannelDTO): Promise<Channel> {
    const { channelId, title, username } = channelDTO;
    const isExists = await this.channelModel.findOne({ where: { channelId } });
    if (isExists) {
      console.log("Канал уже есть в базе");
      return;
    }

    this.cacheService.cleanData("channelIds");
    this.channelModel.create({
      channelId,
      title,
      username,
    });
  }

  async getChannelIds(): Promise<number[]> {
    let channelIds = await this.cacheService.getData<number[]>("channelIds");

    if (!channelIds) {
      const allChannels = await this.findAll();

      if (allChannels.length) {
        channelIds = allChannels.map((channel) => {
          return channel.channelId;
        });
        await this.cacheService.saveData("channelIds", channelIds);
        return channelIds;
      } else {
        channelIds = [];
      }
    }

    return channelIds;
  }
}
