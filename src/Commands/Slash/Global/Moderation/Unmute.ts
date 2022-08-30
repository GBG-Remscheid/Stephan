import { Category } from "@discordx/utilities";
import type { GuildMember, InteractionResponse } from "discord.js";
import {
    ApplicationCommandOptionType,
    Colors,
    CommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
} from "discord.js";
import { Snowflake } from "discord-api-types/v10";
import { Discord, Guard, Slash, SlashGroup, SlashOption } from "discordx";

import { NotGuild } from "../../../../Guards/Global/NotGuild.js";

@Discord()
@Category("Moderation")
@Guard(NotGuild)
@SlashGroup({ description: "all kinds of moderation utils", name: "mod" })
export abstract class Unmute {
    @Slash({
        description:
            "Unmute a previously muted user, who has the 'Muted' role.",
        name: "unmute",
    })
    @SlashGroup("mod")
    async unmute(
        @SlashOption({
            description: "The user you're unmuting.",
            name: "user",
            type: ApplicationCommandOptionType.User,
        })
        targetId: Snowflake,

        interaction: CommandInteraction
    ): Promise<InteractionResponse<boolean>> {
        const { guild, member, user } = interaction;
        if (!guild) {
            return interaction.reply({
                content:
                    "Your server couldn't be fetched while executing your interaction.",
                ephemeral: true,
            });
        }

        const target = await guild.members.fetch(targetId);
        if (!target) {
            return interaction.reply({
                content: "There was an error while fetching the user.",
                ephemeral: true,
            });
        }

        if (
            !(<GuildMember>interaction.member).permissions.has(
                PermissionFlagsBits.ModerateMembers
            )
        ) {
            return interaction.reply({
                content:
                    "You don't have `MODERATE_MEMBERS` permissions to use this command.",
                ephemeral: true,
            });
        }

        if (target.user.bot) {
            return interaction.reply({
                content: "You can't mute a bot.",
                ephemeral: true,
            });
        }
        if (target === member) {
            return interaction.reply({
                content: "You can't unmute yourself.",
                ephemeral: true,
            });
        }
        if (target.id === guild.ownerId) {
            return interaction.reply({
                content: "You can't mute the server owner.",
                ephemeral: true,
            });
        }

        if (!target.isCommunicationDisabled()) {
            return interaction.reply({
                content: "That user isn't muted.",
                ephemeral: true,
            });
        }

        const guildEmbed = new EmbedBuilder()
            .setAuthor({
                iconURL: user.avatarURL() ?? user.defaultAvatarURL,
                name: `Unmuted by ${interaction.user.username}`,
            })
            .setTimestamp()
            .setColor(Colors.Green)
            .setDescription(
                `${target.user.username} has been successfully unmuted. ✅`
            );

        const dmEmbed = new EmbedBuilder()
            .setAuthor({
                iconURL: user.avatarURL() ?? user.defaultAvatarURL,
                name: `Unmuted by ${interaction.user.username}`,
            })
            .setTimestamp()
            .setColor(Colors.Green)
            .setDescription(`You've been unmuted from **${guild.name}**.`);

        target.send({ embeds: [dmEmbed] }).catch(() => {
            interaction.reply({
                content: "There was an error while sending a DM to the user.",
            });
            setTimeout(() => interaction.deleteReply(), 5000);
        });
        target.timeout(null);
        return interaction.reply({ embeds: [guildEmbed] });
    }
}
