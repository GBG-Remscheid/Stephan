import { CommandInteraction } from "discord.js";
import { GuardFunction } from "discordx";

export const NotBot: GuardFunction<CommandInteraction> = async (
    interaction,
    client,
    next
) => {
    if (interaction.user.bot) {
        return
    } else {
        await next();
    }
};