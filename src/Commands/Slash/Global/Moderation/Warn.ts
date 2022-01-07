import type { Snowflake } from "discord-api-types";
import { CommandInteraction, GuildMember, MessageEmbed, Permissions, TextChannel } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import moment from "moment";

@Discord()
@SlashGroup("mod")
export abstract class Warn {
    @Slash("warn", { description: "Sends a warning to a user" })
    async warn(
        @SlashOption("target", { description: 'The user that should be warned', type: 'USER' })
        targetId: Snowflake,

        @SlashOption("reason", { description: 'The reason for the warning', type: "STRING" })
        reason: string,


        interaction: CommandInteraction
    ) {
        const { createdAt, guild, channel, user, member } = interaction;
        if (!guild) return interaction.reply({ content: "Your server couldn't be fetched while executing your interaction.", ephemeral: true });
        const target = await guild.members.fetch(targetId);
        if (!target) return interaction.reply({ content: "The user couldn't be fetched while executing your interaction.", ephemeral: true });

        if (!(<GuildMember>member).permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return interaction.reply({ content: "You don't have `MANAGE_MESSAGES` permissions to use this command.", ephemeral: true });

        if (target.user.bot) return interaction.reply({ content: "You can't warn a bot.", ephemeral: true });
        if (target === member) return interaction.reply({ content: "You can't warn yourself.", ephemeral: true });
        if (target.id === guild.ownerId) return interaction.reply({ content: "You can't warn the server owner.", ephemeral: true });

        const guildEmbed = new MessageEmbed()
            .setTitle("**Warning**")
            .setColor("#FF0C00")
            .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Warning by ${user.username}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .addFields([
                { name: '**Warned User:**', value: `\`${target.user}\`` },
                { name: '**Target ID:**', value: `\`${target.id}\``, inline: true },
                { name: '**Warned By:**', value: `${user}` },
                { name: '**User ID:**', value: `\`${user.id}\``, inline: true },
                { name: '**Reason:**', value: `\`${reason}\`` },
                { name: '**Warn Time:**', value: `\`${moment(createdAt).format('DD. MMMM YYYY, HH:mm')}\`` },
                { name: '**Channel:**', value: `${(<TextChannel>channel)}`, inline: true }
            ]);

        const dmEmbed = new MessageEmbed()
            .setAuthor(`Your Warning`, target.user.displayAvatarURL({ dynamic: true }))
            .setColor('#FF0C00')
            .setThumbnail(guild.iconURL({ dynamic: true }) ?? 'https://cdn.discordapp.com/embed/avatars/0.png')
            .setFooter({ text: `Warning by ${user.username}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .setDescription(`**You have been warned on ${guild.name}**\n`)
            .addField('**Reason:**', `\`${reason}\``)

        interaction.reply({ embeds: [guildEmbed] });
        target.send({ embeds: [dmEmbed] });
        return
    }
}