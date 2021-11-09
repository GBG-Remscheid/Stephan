import { Snowflake } from "discord-api-types";
import { CommandInteraction, GuildMember, MessageEmbed, Permissions } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import moment from "moment";

@Discord()
@SlashGroup("mod")
export abstract class Kick {
    @Slash("kick", { description: "Kick a user from your server" })
    async kick(
        @SlashOption("user", { description: "The user you want to kick", required: true, type: "USER" })
        targetId: Snowflake,

        @SlashOption("reason", { description: "Your reason for kicking the user.", required: true, type: "STRING" })
        reason: string,

        interaction: CommandInteraction
    ) {
        const { channel, createdAt, guild, member, user } = interaction;

        const target = await guild.members.fetch(targetId);
        if (!target) return interaction.reply({ content: "The user you want to kick couldn't be fetched.", ephemeral: true });

        if (!(<GuildMember>member).permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return interaction.reply({ content: "You don't have `KICK_MEMBERS` permissions to use this command.", ephemeral: true });

        if (target.user.bot) return interaction.reply({ content: "You can't ban a bot.", ephemeral: true });
        if (target === member) return interaction.reply({ content: "You can't kick yourself.", ephemeral: true });
        if (target.id === guild.ownerId) return interaction.reply({ content: "You can't kick the server owner.", ephemeral: true });


        const serverEmbed = new MessageEmbed()
            .setAuthor("Kick Info", target.user.displayAvatarURL({ dynamic: true }))
            .setColor("#FF0C00")
            .setFooter(`Kick executed by ${user.username}`, user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .addFields([
                { name: '**Kicked User:**', value: `${target.user}` },
                { name: '**Target ID:**', value: `\`${target.id}\``, inline: true },
                { name: '**Kicked By:**', value: `${user}` },
                { name: '**User ID:**', value: `\`${user.id}\``, inline: true },
                { name: '**Kick Reason:**', value: `\`${reason}\`` },
                { name: '**Kick Time:**', value: `\`${moment(createdAt).format('DD. MMMM YYYY, HH:mm')}\`` },
                { name: '**Channel:**', value: `${channel}` },
            ]);

        const dmEmbed = new MessageEmbed()
            .setAuthor(`Your Kick Info`, target.user.displayAvatarURL({ dynamic: true }))
            .setColor('#FF0C00')
            .setFooter(`Kick executed by ${user.username}`, user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setDescription(
                `**You have been kicked from ${guild.name}**\n`,
            )
            .addField("**Reason:**", `${reason}`);

        interaction.reply({ embeds: [serverEmbed] })
        target.send({ embeds: [dmEmbed] }).catch(() => {
            interaction.reply("There was an error while sending a DM to the user.");
            setTimeout(() => interaction.deleteReply(), 5000)
        })
        target.kick(reason);
        return

    }
}