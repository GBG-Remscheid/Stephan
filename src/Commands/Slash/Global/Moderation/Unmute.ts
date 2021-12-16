import type { Snowflake } from "discord-api-types";
import { CommandInteraction, GuildMember, MessageEmbed, Permissions } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";

@Discord()
@SlashGroup("mod")
export abstract class Unmute {
    @Slash("unmute", { description: "Unmute a previously muted user, who has the 'Muted' role." })
    async unmute(
        @SlashOption("user", { description: "The user you're unmuting.", required: true, type: "USER" })
        targetId: Snowflake,

        interaction: CommandInteraction
    ) {
        const { guild, member, user } = interaction;
        if (!guild) return interaction.reply({ content: "Your server couldn't be fetched while executing your interaction.", ephemeral: true });

        const target = await guild.members.fetch(targetId);
        if (!target) return interaction.reply({ content: "There was an error while fetching the user.", ephemeral: true });

        const muterole = guild.roles.cache.find(muterole => muterole.name === 'Muted');
        if (!muterole) return interaction.reply({ content: "There was an error while fetching the 'Muted' role.", ephemeral: true });

        if (!(<GuildMember>interaction.member).permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return interaction.reply({ content: "You don't have `MANAGE_ROLES` permissions to use this command.", ephemeral: true });

        if (target.user.bot) return interaction.reply("You can't mute a bot, you idiot.");
        if (target === member) return interaction.reply("You can't mute yourself.");
        if (target.id === guild.ownerId) return interaction.reply({ content: "You can't mute the server owner.", ephemeral: true });

        const guildEmbed = new MessageEmbed()
            .setAuthor(`Unmuted by ${interaction.user.username}`, user.avatarURL({ dynamic: true }) ?? user.defaultAvatarURL)
            .setTimestamp()
            .setColor("GREEN")
            .setDescription(`${target.user.username} has been successfully unmuted. ✅`)

        const dmEmbed = new MessageEmbed()
            .setAuthor(`Unmuted by ${interaction.user.username}`, user.avatarURL({ dynamic: true }) ?? user.defaultAvatarURL)
            .setTimestamp()
            .setColor("GREEN")
            .setDescription(`You've been unmuted from **${guild.name}**.`)

        target.send({ embeds: [dmEmbed] }).catch(() => {
            interaction.reply({ content: "There was an error while sending a DM to the user." })
            setTimeout(() => interaction.deleteReply(), 5000)
        });
        target.roles.remove(muterole).catch(() => {
            interaction.reply("There was an error while removing the muterole.");
            setTimeout(() => interaction.deleteReply(), 5000)
        });
        interaction.reply({ embeds: [guildEmbed] });
        return;
    }
}