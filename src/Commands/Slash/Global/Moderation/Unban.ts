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
export abstract class Unban {
    @Slash({ description: "Unban a banned user", name: "unban" })
    @SlashGroup("mod")
    async unban(
        @SlashOption({
            description: "The user you want to unban",
            name: "user-id",
            type: ApplicationCommandOptionType.User,
        })
        targetId: Snowflake,

        interaction: CommandInteraction
    ): Promise<InteractionResponse<boolean>> {
        const { member, guild, user } = interaction;
        if (!guild) {
            return interaction.reply({
                content:
                    "Your server couldn't be fetched while executing your interaction.",
                ephemeral: true,
            });
        }
        const target = await guild.bans.remove(targetId);
        if (!target) {
            return interaction.reply({
                content: "The given user couldn't be fetched.",
                ephemeral: true,
            });
        }

        if (
            !(<GuildMember>interaction.member).permissions.has(
                PermissionFlagsBits.BanMembers
            )
        ) {
            return interaction.reply({
                content:
                    "You don't have `BAN_MEMBERS` permissions to use this command.",
                ephemeral: true,
            });
        }

        if (target.bot) {
            return interaction.reply({
                content: "You can't unban a bot",
                ephemeral: true,
            });
        }
        if (target === member?.user) {
            return interaction.reply({
                content: "You can't unban yourself.",
                ephemeral: true,
            });
        }
        if (target.id === guild.ownerId) {
            return interaction.reply({
                content: "You can't unban the server owner.",
                ephemeral: true,
            });
        }

        const guildEmbed = new EmbedBuilder()
            .setAuthor({
                iconURL: user.avatarURL() ?? user.defaultAvatarURL,
                name: `Unbanned by ${user.username}`,
            })
            .setTimestamp()
            .setColor(Colors.Green)
            .setDescription(
                `${target.username} has been successfully unbanned. ✅`
            );

        const dmEmbed = new EmbedBuilder()
            .setAuthor({
                iconURL: user.avatarURL() ?? user.defaultAvatarURL,
                name: `Unbanned by ${user.username}`,
            })
            .setTimestamp()
            .setColor(Colors.Green)
            .setDescription(`You've been unbanned from **${guild.name}**.`);

        target.send({ embeds: [dmEmbed] }).catch(() => {
            interaction.reply({
                content: "There was an error while sending a DM to the user.",
            });
            setTimeout(() => interaction.deleteReply(), 5000);
        });
        return interaction.reply({ embeds: [guildEmbed] });
    }
}
