import {
    CommandInteraction,
    GuildMember,
    MessageEmbed,
    Permissions,
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
export abstract class Ban {
    @Slash("ban", {
        description: "Ban a specific user from a server (tmp or infinite).",
    })
    @SlashGroup({ name: "mod" })
    async ban(
        @SlashOption("user", {
            description: "The user that should be banned",
            type: "USER",
        })
        targetId: Snowflake,

        @SlashOption("reason", {
            description: "The ban reason",
            type: "STRING",
        })
        reason: string,

        @SlashOption("days", {
            description: "The optional duration for a temporary ban",
            required: false,
            type: "INTEGER",
        })
        duration: number,

        interaction: CommandInteraction
    ): Promise<void> {
        const { channel, createdAt, guild, member, user } = interaction;
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
                content: "The user you selected could not be fetched.",
                ephemeral: true,
            });
        }

        const banhammer = "https://i.imgur.com/u4B5RRF.png";

        if (
            !(<GuildMember>member).permissions.has(
                Permissions.FLAGS.BAN_MEMBERS
            )
        ) {
            return interaction.reply({
                content:
                    "You don't have `BAN_MEMBERS` permissions to use this command.",
                ephemeral: true,
            });
        }

        if (target.user.bot) {
            return interaction.reply({
                content: "You can't ban a bot.",
                ephemeral: true,
            });
        }
        if (target === member) {
            return interaction.reply({
                content: "You can't ban yourself.",
                ephemeral: true,
            });
        }
        if (target.id === guild.ownerId) {
            return interaction.reply({
                content: "You can't ban the server owner.",
                ephemeral: true,
            });
        }

        const serverEmbed = new MessageEmbed()
            .setAuthor({
                iconURL: target.user.displayAvatarURL({ dynamic: true }),
                name: "Ban Info",
            })
            .setColor("#FF0C00")
            .setThumbnail(banhammer)
            .setFooter({
                iconURL: user.displayAvatarURL({ dynamic: true }),
                text: `Ban executed by ${user.username}`,
            })
            .setTimestamp()
            .addFields([
                { name: "**Banned User:**", value: `${target.user}` },
                {
                    inline: true,
                    name: "**Target ID:**",
                    value: `\`${target.id}\``,
                },
                { name: "**Banned By:**", value: `${user}` },
                { inline: true, name: "**User ID:**", value: `\`${user.id}\`` },
                { name: "**Ban Reason:**", value: `\`${reason}\`` },
                {
                    name: "**Ban Time:**",
                    value: `\`${moment(createdAt).format(
                        "DD. MMMM YYYY, HH:mm"
                    )}\``,
                },
                { name: "**Channel:**", value: `${channel}` },
                {
                    inline: true,
                    name: "**Ban Duration:**",
                    value: `${duration ? `${duration} day(s)` : "Infinte"}`,
                },
            ]);

        const dmEmbed = new MessageEmbed()
            .setAuthor({
                iconURL: target.user.displayAvatarURL({ dynamic: true }),
                name: "Your Ban Info",
            })
            .setColor("#FF0C00")
            .setThumbnail(banhammer)
            .setFooter({
                iconURL: user.displayAvatarURL({ dynamic: true }),
                text: `Ban executed by ${user.username}`,
            })
            .setTimestamp()
            .setDescription(`**You have been banned from ${guild.name}**\n`)
            .addField("**Reason:**", `${reason}`);

        interaction.reply({ embeds: [serverEmbed] });
        target.send({ embeds: [dmEmbed] }).catch(() => {
            interaction.reply(
                "There was an error while sending a DM to the user."
            );
            setTimeout(() => interaction.deleteReply(), 5000);
        });
        duration
            ? target.ban({ days: duration, reason: reason })
            : target.ban({ reason: reason });
        return;
    }
}
