import {
    CommandInteraction,
    GuildMember,
    MessageEmbed,
    Permissions,
    TextChannel,
} from "discord.js";
import { Discord, Guard, Slash, SlashGroup, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import { NotGuild } from "../../../../Guards/Global/NotGuild.js";
import type { Snowflake } from "discord-api-types";
import moment from "moment";

@Discord()
@Category("Moderation")
@Guard(NotGuild)
@SlashGroup({ description: "all kinds of moderation utils", name: "mod" })
export abstract class Warn {
    @Slash("warn", { description: "Sends a warning to a user" })
    @SlashGroup("mod")
    async warn(
        @SlashOption("target", {
            description: "The user that should be warned",
            type: "USER",
        })
        targetId: Snowflake,

        @SlashOption("reason", {
            description: "The reason for the warning",
            type: "STRING",
        })
        reason: string,

        interaction: CommandInteraction
    ): Promise<void> {
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
                Permissions.FLAGS.MANAGE_MESSAGES
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

        const guildEmbed = new MessageEmbed()
            .setTitle("**Warning**")
            .setColor("#FF0C00")
            .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
            .setFooter({
                iconURL: user.displayAvatarURL({ dynamic: true }),
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

        const dmEmbed = new MessageEmbed()
            .setAuthor({
                iconURL: target.user.displayAvatarURL({ dynamic: true }),
                name: "Your Warning",
            })
            .setColor("#FF0C00")
            .setThumbnail(
                guild.iconURL({ dynamic: true }) ??
                    "https://cdn.discordapp.com/embed/avatars/0.png"
            )
            .setFooter({
                iconURL: user.displayAvatarURL({ dynamic: true }),
                text: `Warning by ${user.username}`,
            })
            .setTimestamp()
            .setDescription(`**You have been warned on ${guild.name}**\n`)
            .addField("**Reason:**", `\`${reason}\``);

        interaction.reply({ embeds: [guildEmbed] });
        target.send({ embeds: [dmEmbed] });
    }
}
