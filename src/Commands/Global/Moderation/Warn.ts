import { Category } from "@discordx/utilities";
import type { GuildMember, InteractionResponse, TextChannel } from "discord.js";
import {
    ApplicationCommandOptionType,
    CommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
} from "discord.js";
import { Snowflake } from "discord-api-types/v10";
import { Discord, Guard, Slash, SlashGroup, SlashOption } from "discordx";
import moment from "moment";

import { NotGuild } from "../../../Guards/Global/NotGuild.js";

@Discord()
@Category("Moderation")
@Guard(NotGuild)
@SlashGroup({ description: "all kinds of moderation utils", name: "mod" })
export abstract class Warn {
    @Slash({ description: "Sends a warning to a user", name: "warn" })
    @SlashGroup("mod")
    async warn(
        @SlashOption({
            description: "The user that should be warned",
            name: "user",
            type: ApplicationCommandOptionType.User,
        })
        targetId: Snowflake,

        @SlashOption({
            description: "The reason for the warning",
            name: "reason",
            type: ApplicationCommandOptionType.String,
        })
        reason: string,

        interaction: CommandInteraction
    ): Promise<InteractionResponse<boolean>> {
        const { createdAt, guild, channel, user, member } = interaction;
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
                content:
                    "The user couldn't be fetched while executing your interaction.",
                ephemeral: true,
            });
        }

        if (
            !(<GuildMember>member).permissions.has(
                PermissionFlagsBits.ManageMessages
            )
        ) {
            return interaction.reply({
                content:
                    "You don't have `MANAGE_MESSAGES` permissions to use this command.",
                ephemeral: true,
            });
        }

        if (target.user.bot) {
            return interaction.reply({
                content: "You can't warn a bot.",
                ephemeral: true,
            });
        }
        if (target === member) {
            return interaction.reply({
                content: "You can't warn yourself.",
                ephemeral: true,
            });
        }
        if (target.id === guild.ownerId) {
            return interaction.reply({
                content: "You can't warn the server owner.",
                ephemeral: true,
            });
        }

        const guildEmbed = new EmbedBuilder()
            .setTitle("**Warning**")
            .setColor("#FF0C00")
            .setThumbnail(target.user.displayAvatarURL())
            .setFooter({
                iconURL: user.displayAvatarURL(),
                text: `Warning by ${user.username}`,
            })
            .setTimestamp()
            .addFields([
                { name: "**Warned User:**", value: `\`${target.user}\`` },
                {
                    inline: true,
                    name: "**Target ID:**",
                    value: `\`${target.id}\``,
                },
                { name: "**Warned By:**", value: `${user}` },
                { inline: true, name: "**User ID:**", value: `\`${user.id}\`` },
                { name: "**Reason:**", value: `\`${reason}\`` },
                {
                    name: "**Warn Time:**",
                    value: `\`${moment(createdAt).format(
                        "DD. MMMM YYYY, HH:mm"
                    )}\``,
                },
                {
                    inline: true,
                    name: "**Channel:**",
                    value: `${<TextChannel>channel}`,
                },
            ]);

        const dmEmbed = new EmbedBuilder()
            .setAuthor({
                iconURL: target.user.displayAvatarURL(),
                name: "Your Warning",
            })
            .setColor("#FF0C00")
            .setThumbnail(
                guild.iconURL() ??
                    "https://cdn.discordapp.com/embed/avatars/0.png"
            )
            .setFooter({
                iconURL: user.displayAvatarURL(),
                text: `Warning by ${user.username}`,
            })
            .setTimestamp()
            .setDescription(`**You have been warned on ${guild.name}**\n`)
            .addFields([{ name: "**Reason:**", value: `\`${reason}\`` }]);

        target.send({ embeds: [dmEmbed] });
        return interaction.reply({ embeds: [guildEmbed] });
    }
}
