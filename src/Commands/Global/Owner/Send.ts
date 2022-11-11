import { Category } from "@discordx/utilities";
import type { InteractionResponse } from "discord.js";
import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Snowflake } from "discord-api-types/v10";
import { Discord, Slash, SlashOption } from "discordx";

@Discord()
// @Permission(false)
// @Permission({ id: "463044315007156224", permission: true, type: "USER" })
// @Permission({ id: "428119121423761410", permission: true, type: "USER" })
@Category("Owner")
export abstract class Send {
    @Slash({ description: "Send a message to a user", name: "send" })
    async send(
        @SlashOption({
            description: "The user the message is going to be send to.",
            name: "user",
            required: true,
            type: ApplicationCommandOptionType.User,
        })
        targetId: Snowflake,

        @SlashOption({
            description: "The message you want to send.",
            name: "message",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        message: string,

        interaction: CommandInteraction,
    ): Promise<void | InteractionResponse<boolean>> {
        const { guild } = interaction;
        if (!guild) {
            return interaction.reply({
                content:
                    "Your server couldn't be fetched while executing your interaction.",
                ephemeral: true,
            });
        }

        const user = await guild.members.fetch(targetId);
        if (!user) {
            return interaction.reply({
                content: "This user is not on this server.",
                ephemeral: true,
            });
        }

        try {
            user.send(message);
            interaction.reply("The message has been send. ✅");
            setTimeout(() => interaction.deleteReply(), 5000);
        } catch (error) {
            interaction.reply(
                `There was an error while sending the message:\n ${error}`,
            );
            setTimeout(() => interaction.deleteReply(), 5000);
        }
    }
}
