import type { Snowflake } from "discord-api-types";
import { CommandInteraction, GuildMember, MessageEmbed, Permissions } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";

@Discord()
@SlashGroup("mod")
export abstract class Unban {
    @Slash("unban", { description: "Unban a banned user" })
    async unban(
        @SlashOption("user-id", { description: "The user you want to unban", required: true, type: "USER" })
        targetId: Snowflake,

        interaction: CommandInteraction
    ) {
        const { member, guild, user } = interaction;
        if (!guild) return interaction.reply({ content: "Your server couldn't be fetched while executing your interaction.", ephemeral: true });
        const target = await guild.bans.remove(targetId);
        if (!target) return interaction.reply({ content: "The given user couldn't be fetched.", ephemeral: true })

        if (!(<GuildMember>interaction.member).permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return interaction.reply({ content: "You don't have `BAN_MEMBERS` permissions to use this command.", ephemeral: true });

        if (target.bot) return interaction.reply("You can't warn a bot, you idiot.");
        if (target === member.user) return interaction.reply("You can't warn yourself.");
        if (target.id === guild.ownerId) return interaction.reply({ content: "You can't mute the server owner.", ephemeral: true });

        const guildEmbed = new MessageEmbed()
            .setAuthor(`Unbanned by ${user.username}`, user.avatarURL({ dynamic: true }) ?? user.defaultAvatarURL)
            .setTimestamp()
            .setColor("GREEN")
            .setDescription(`${target.username} has been successfully unbanned. ✅`)

        const dmEmbed = new MessageEmbed()
            .setAuthor(`Unbanned by ${user.username}`, user.avatarURL({ dynamic: true }) ?? user.defaultAvatarURL)
            .setTimestamp()
            .setColor("GREEN")
            .setDescription(`You've been unbanned from **${guild.name}**.`)

        target.send({ embeds: [dmEmbed] }).catch(() => {
            interaction.reply({ content: "There was an error while sending a DM to the user." })
            setTimeout(() => interaction.deleteReply(), 5000)
        });
        interaction.reply({ embeds: [guildEmbed] });
        return;
    }
}