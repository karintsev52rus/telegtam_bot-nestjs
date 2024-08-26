import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import TelegramBot from "node-telegram-bot-api";
import { commands } from "./commands";
import { getSigned32BitNumber } from "../utils/requestId";
import { ChannelService } from "src/channels/channel.service";
import { ChatService } from "src/chats/chat.service";
import { ADD_CHANNEL, GET_CHANNELS_LIST, MENU, START } from "./constants";
import { Chat } from "node-telegram-bot-api";
import {
  acceptMsg,
  btnValidMsg,
  greetingMsg,
  validateMsg,
} from "src/utils/messages";
import {
  joinChannelKeyboardOptions,
  menuKeyboardOptions,
} from "src/utils/keyboardOptions";
import { hasPassedTwoDays } from "src/utils/verifyTimeout";
import { useSendMessage } from "src/hooks/useSendMessage";

@Injectable()
export class TelegramBotService {
  bot: TelegramBot;

  constructor(
    private readonly channelService: ChannelService,
    private readonly chatService: ChatService,
    private configService: ConfigService
  ) {
    this.bot = new TelegramBot(
      this.configService.get("TELEGRAM_BOT_API_TOKEN"),
      {
        polling: true,
      }
    );
  }

  async onModuleInit() {
    await this.onStart();
  }

  async onStart() {
    this.bot.setMyCommands(commands);

    this.bot.on("chat_join_request", (joinRequesData) => {
      this.onChatJoinRequest(joinRequesData);
    });

    this.bot.on("message", (msg) => {
      this.onTextMessage(msg);
    });

    this.bot.on("callback_query", (ctx) => {
      this.onCallbackQuery(ctx);
    });
  }

  onTextMessage = async (msg: TelegramBot.Message) => {
    const login = this.getLogin(msg.from);
    const text = msg.text;

    switch (text) {
      case `/${START}`:
        return await this.bot.sendMessage(msg.chat.id, greetingMsg(login), {
          parse_mode: "HTML",
        });

      case `/${MENU}`:
        return await this.bot.sendMessage(
          msg.chat.id,
          "Меню бота",
          menuKeyboardOptions
        );

      case ADD_CHANNEL:
        await this.chooseUserChannel(msg);
        break;

      case GET_CHANNELS_LIST:
        await this.getBotChannelsList(msg);
        break;

      default:
        break;
    }

    if (msg.chat_shared) {
      try {
        const chatId = msg.chat_shared.chat_id;
        const chat = await this.bot.getChat(chatId);
        await this.channelService.addOne({
          channelId: chat.id,
          title: chat.title,
          username: chat.username,
        });

        return await this.bot.sendMessage(
          msg.chat.id,
          "Канал успешно добавлен"
        );
      } catch (error) {
        console.log(error);
        return await this.bot.sendMessage(msg.chat.id, "Что-то пошло не так");
      }
    }
  };

  onChatJoinRequest = async ({
    user_chat_id,
    chat,
    date,
    from,
  }: TelegramBot.ChatJoinRequest) => {
    const userId = user_chat_id;
    const { username } = chat;
    try {
      if (from.is_bot) {
        await this.bot.declineChatJoinRequest(chat.id, userId);
      }

      await this.chatService.addChat({
        chatId: chat.id,
        username,
        userId: user_chat_id,
        date,
      });

      const login = this.getLogin(from);

      await this.bot.sendMessage(
        userId,
        validateMsg(login),
        useSendMessage({
          inline_keyboard: [
            [{ text: btnValidMsg, callback_data: chat.id.toString() }], // callback_data: id чата в который хочет вступить пользователь
          ],
        })
      );
    } catch (error) {
      console.log(error);
      await this.bot.sendMessage(userId, "Что-то пошло не так");
    }
  };

  onCallbackQuery = async (ctx: TelegramBot.CallbackQuery) => {
    try {
      const { message, data } = ctx;
      const fromUser: TelegramBot.User = ctx.from;
      const chatId = data ? Number(ctx.data) : null;
      const btnText = message.reply_markup.inline_keyboard[0][0].text; // btnValidMsg
      if (!btnText || chatId) {
        return;
      }
      if (btnText === btnValidMsg && data) {
        await this.verifyUser(fromUser, chatId);
      }
    } catch (error) {
      console.log(error);
      await this.bot.sendMessage(ctx.message.chat.id, "Что-то пошло не так");
    }
  };

  getLogin = (user: TelegramBot.User) => {
    return user.first_name || user.last_name || user.username;
  };

  chooseUserChannel = async (msg: TelegramBot.Message) => {
    const requestId = getSigned32BitNumber();
    return await this.bot.sendMessage(
      msg.chat.id,
      "Выберите канал",
      joinChannelKeyboardOptions(requestId)
    );
  };

  getBotAdminChannels = async (channelIds: number[]) => {
    try {
      const channelsInfo: Chat[] = [];
      const botUsername = this.configService.get("TELEGRAM_BOT_USERNAME");
      if (channelIds.length) {
        for (const id of channelIds) {
          try {
            const chatAdmins = await this.bot.getChatAdministrators(id);
            const chatAdminsUsernames = chatAdmins.map((admin) => {
              return admin.user.username;
            });
            if (chatAdminsUsernames.includes(botUsername)) {
              const channelInfo = await this.bot.getChat(id);
              channelsInfo.push(channelInfo);
            }
          } catch (error) {
            continue;
          }
        }
      }
      return channelsInfo;
    } catch (error) {
      console.log(`getBotAdminChannels error`);
    }
  };

  getBotChannelsList = async (msg: TelegramBot.Message) => {
    try {
      const channelIds = await this.channelService.getChannelIds();
      const channels = await this.getBotAdminChannels(channelIds);
      if (!channels.length || !channels.length) {
        return this.bot.sendMessage(
          msg.chat.id,
          "В базе данных пока нет каналов"
        );
      }

      channels.forEach((channel) => {
        this.bot.sendMessage(msg.chat.id, channel.title, {
          reply_markup: {
            inline_keyboard: [[{ text: "Открыть", url: channel.invite_link }]],
          },
        });
      });
    } catch (error) {
      console.log(`getBotChannelsList error`);
    }
  };

  verifyUser = async (user: TelegramBot.User, targetChatId: number) => {
    console.log("verify");
    try {
      const { is_bot, id } = user;
      /* console.log(data); */

      if (is_bot) {
        console.log("is_bot");
        await this.bot.declineChatJoinRequest(targetChatId, id);
        return;
      }

      const chat = await this.chatService.findChat(id);
      if (!chat) {
        console.log("!chat");
        return;
      }

      if (hasPassedTwoDays(chat.date)) {
        await this.chatService.deleteChat(id);
        console.log("hasPassedTwoDays");
        return;
      }

      await this.bot.approveChatJoinRequest(targetChatId, id);

      const targetChatInfo = await this.bot.getChat(targetChatId);
      const { invite_link } = targetChatInfo;

      await this.bot.sendMessage(
        id,
        acceptMsg,
        useSendMessage({
          inline_keyboard: [
            [
              {
                text: "Открыть",
                url: invite_link,
              },
            ],
          ],
          remove_keyboard: true,
        })
      );
      await this.chatService.deleteChat(id);
    } catch (error) {
      console.log();
    }
  };
}
