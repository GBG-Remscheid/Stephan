import { GuardFunction, ArgsOf } from "@typeit/discord";

export const NotBot: GuardFunction<ArgsOf<"message">> = async ([message], client, next) => {
  if (client.user.id !== message.author.id) {
    await next();
  }
};
