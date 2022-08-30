import type { CommandInteraction } from "discord.js";
import type { GuardFunction } from "discordx";

export const NotGuild: GuardFunction<CommandInteraction> = async (
    interaction,
    client,
    next
) => {
    if (!interaction.guild) {
        return interaction.reply({
            content: "This command can only be used in a server.",
            ephemeral: true,
        });
    } else {
        await next();
    }
};
