import { Snowflake } from "discord-api-types";
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
        const { guild, member } = interaction;

        const target = await guild.members.fetch(targetId);
        if (!target) return interaction.reply({ content: "There was an error while fetching the user.", ephemeral: true });

        const muterole = guild.roles.cache.find(muterole => muterole.name === 'Muted');

        if (!(<GuildMember>interaction.member).permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return interaction.reply("You don't have `MANAGE_ROLES` permissions to use this command.");

        if (target.user.bot) return interaction.reply("You can't warn a bot, you idiot.");
        if (target === member) return interaction.reply("You can't warn yourself.");
        if (target.id === guild.ownerId) return interaction.reply({ content: "You can't mute the server owner.", ephemeral: true });

        const guildEmbed = new MessageEmbed()
            .setAuthor(`Unbanned by ${interaction.user.username}`, interaction.user.avatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor("GREEN")
            .setDescription(`${target.user.username} has been successfully unbanned. ✅`)

        const dmEmbed = new MessageEmbed()
            .setAuthor(`Unbanned by ${interaction.user.username}`, interaction.user.avatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor("GREEN")
            .setDescription(`You've been unbanned from **${interaction.guild.name}**.`)

        target.send({ embeds: [dmEmbed] }).catch(() => {
            interaction.reply({ content: "There was an error while sending a DM to the user." })
            setTimeout(() => interaction.deleteReply(), 5000)
        });
        interaction.reply({ embeds: [guildEmbed] });
        target.roles.remove(muterole).catch(() => {
            interaction.reply("There was an error while removing the muterole.");
            setTimeout(() => interaction.deleteReply(), 5000)
        });
        return;
    }
}