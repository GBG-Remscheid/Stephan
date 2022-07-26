import { CommandInteraction } from "discord.js";
import type { GuardFunction } from "discordx";

export const NotBotOwner: GuardFunction<CommandInteraction> = async (
    interaction,
    client,
    next
) => {
    if (process.env.NODE_ENV === "development") {
        if (
            interaction.user.id !== "463044315007156224" &&
            interaction.user.id !== "428119121423761410"
        ) {
            return interaction.reply({
                content:
                    "Because this bot is in development mode right now, commands are disabled for non-developers.",
                ephemeral: true,
            });
        }
    } else {
        await next();
    }
};
