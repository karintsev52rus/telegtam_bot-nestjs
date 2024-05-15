import { ADD_CHANNEL, GET_CHANNELS_LIST } from "src/telegram-bot/constants";

export const joinChannelKeyboardOptions = (requestId: number) => {
  return {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [
        [
          {
            text: "Выбрать канал",
            request_chat: {
              chat_is_channel: true,
              request_id: requestId,
              user_administrator_rights: {
                can_post_messages: true,
                can_manage_chat: true,
                can_change_info: false,
                can_delete_messages: false,
                can_invite_users: true,
                can_manage_video_chats: false,
                can_promote_members: false,
                can_restrict_members: false,
                is_anonymous: false,
                can_delete_stories: false,
                can_edit_stories: false,
                can_post_stories: false,
              },
              bot_administrator_rights: {
                can_post_messages: true,
                can_manage_chat: false,
                can_change_info: false,
                can_delete_messages: false,
                can_invite_users: true,
                can_manage_video_chats: false,
                can_promote_members: false,
                can_restrict_members: false,
                is_anonymous: false,
                can_delete_stories: false,
                can_edit_stories: false,
                can_post_stories: false,
              },
            },
          },
        ],
      ],
    },
  };
};

export const menuKeyboardOptions = {
  reply_markup: {
    resize_keyboard: true,
    keyboard: [[{ text: GET_CHANNELS_LIST }, { text: ADD_CHANNEL }]],
  },
};
