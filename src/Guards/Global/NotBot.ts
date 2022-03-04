import type { ArgsOf, GuardFunction } from "discordx";
import {
    ButtonInteraction,
    CommandInteraction,
    ContextMenuInteraction,
    Message,
    MessageReaction,
    SelectMenuInteraction,
    VoiceState,
} from "discord.js";
import { SimpleCommandMessage } from "discordx";

export const NotBot: GuardFunction<
    | ArgsOf<"messageCreate" | "messageReactionAdd" | "voiceStateUpdate">
    | CommandInteraction
    | ContextMenuInteraction
    | SelectMenuInteraction
    | ButtonInteraction
    | SimpleCommandMessage
> = async (arg, client, next, guardData) => {
    const argObj = arg instanceof Array ? arg[0] : arg;
    const user =
        argObj instanceof CommandInteraction
            ? argObj.user
            : argObj instanceof MessageReaction
            ? argObj.message.author
            : argObj instanceof VoiceState
            ? argObj.member?.user
            : argObj instanceof Message
            ? argObj.author
            : argObj instanceof SimpleCommandMessage
            ? argObj.message.author
            : argObj instanceof CommandInteraction ||
              argObj instanceof ContextMenuInteraction ||
              argObj instanceof SelectMenuInteraction ||
              argObj instanceof ButtonInteraction
            ? argObj.member?.user
            : argObj.message.author;
    if (!user?.bot) {
        guardData.message = "The NotBot guard passed";
        await next();
    }
};
