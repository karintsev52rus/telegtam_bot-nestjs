export const validateMsg = (login?: string) =>
  `<code> Добро пожаловать, ${login && login + ","} подтвердите, что вы не робот!</code>`;

export const btnValidMsg = "Я не робот";
export const btnToMsg = "Перейти в канал";
export const acceptMsg = `<b>Аккаунт успешно подтвержден!</b>`;

export const greetingMsg = (login?: string) =>
  `<code> Добро пожаловать, ${login && login + ","} этот бот может добавлять каналы пользователей в базу данных и получать их список </code>`;
