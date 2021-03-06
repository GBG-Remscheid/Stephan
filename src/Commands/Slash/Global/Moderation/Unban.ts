import {
    ApplicationCommandOptionType,
    Colors,
    CommandInteraction,
    EmbedBuilder,
    GuildMember,
    InteractionResponse,
    PermissionFlagsBits,
} from "discord.js";
import { Discord, Guard, Slash, SlashGroup, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import { NotGuild } from "../../../../Guards/Global/NotGuild.js";
import type { Snowflake } from "discord-api-types/v10";

@Discord()
@Category("Moderation")
@Guard(NotGuild)
@SlashGroup({ description: "all kinds of moderation utils", name: "mod" })
export abstract class Unban {
    @Slash("unban", { description: "Unban a banned user" })
    @SlashGroup("mod")
    async unban(
        @SlashOption("user-id", {
            description: "The user you want to unban",
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
                `${target.username} has been successfully unbanned. ???`
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
