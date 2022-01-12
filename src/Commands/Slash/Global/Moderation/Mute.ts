import { Category } from "@discordx/utilities";
import type { Snowflake } from "discord-api-types";
import { CommandInteraction, GuildMember, MessageEmbed, Permissions } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import moment from "moment";

@Discord()
@Category("Moderation")
@SlashGroup("mod")
export abstract class Mute {
    @Slash("mute", { description: "Mute a specific user on your server for a specific time." })
    async mute(
        @SlashOption("user", { description: "The user you'd like to mute", type: "USER" })
        targetId: Snowflake,

        @SlashOption("reason", { description: "The reason for your mute", type: "STRING" })
        reason: string,

        @SlashOption("days", { description: "The duration for your mute", type: "NUMBER" })
        duration: number,


        interaction: CommandInteraction
    ) {
        const { channel, createdAt, guild, member, user } = interaction;
        if (!guild) return interaction.reply({ content: "Your server couldn't be fetched while executing your interaction.", ephemeral: true });

        const target = await guild.members.fetch(targetId);
        if (!target) return interaction.reply({ content: "There was an error while fetching the user.", ephemeral: true });
        if (target.user.bot) return interaction.reply({ content: "You can't mute a bot.", ephemeral: true });
        if (target === member) return interaction.reply({ content: "You can't mute yourself.", ephemeral: true });
        if (target.id === guild.ownerId) return interaction.reply({ content: "You can't mute the server owner.", ephemeral: true });

        if (target.isCommunicationDisabled()) return interaction.reply({ content: "That user is already muted.", ephemeral: true });

        let mDuration: moment.Duration;
        let milliseconds: number;

        if (!(<GuildMember>member).permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) return interaction.reply({ content: "You don't have `MODERATE_MEMBERS` permissions to use this command.", ephemeral: true });

        mDuration = moment.duration(duration, 'days');
        milliseconds = mDuration.asMilliseconds();

        await target.timeout(milliseconds, reason);

        const serverEmbed = new MessageEmbed()
            .setAuthor({ name: "Mute Info", iconURL: target.user.displayAvatarURL({ dynamic: true }) })
            .setColor("#FF0C00")
            .setFooter({ text: `Mute executed by ${user.username}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .addFields([
                { name: '**Muted User:**', value: `${target.user}` },
                { name: '**Target ID:**', value: `\`${target.id}\``, inline: true },
                { name: '**Muted By:**', value: `${user}` },
                { name: '**User ID:**', value: `\`${user.id}\``, inline: true },
                { name: '**Mute Reason:**', value: `\`${reason}\`` },
                { name: '**Mute Time:**', value: `\`${moment(createdAt).format('DD. MMMM YYYY, HH:mm')}\`` },
                { name: '**Channel:**', value: `${channel}` },
                { name: '**Mute Duration:**', value: `${duration ? `${duration} day(s)` : 'Infinite'}`, inline: true },
                { name: '**Mute End:**', value: `${moment(target.communicationDisabledUntil).format('DD. MMMM YYYY, HH:mm')}, ${moment(target.communicationDisabledUntil).fromNow()}` }
            ])

        const dmEmbed = new MessageEmbed()
            .setAuthor({ name: `Your Mute Info`, iconURL: target.user.displayAvatarURL({ dynamic: true }) })
            .setColor('#FF0C00')
            .setFooter({ text: `Mute executed by ${user.username}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .setDescription(
                `**You have been muted on ${guild.name}**\n`,
            )
            .addField("**Reason:**", `${reason}`)
            .addField("**Mute Duration:**", `${duration} day(s)`, true)
            .addField("**Mute End:**", `${moment(target.communicationDisabledUntil).format('DD. MMMM YYYY, HH:mm')}, ${moment(target.communicationDisabledUntil).fromNow()}`);

        interaction.reply({ embeds: [serverEmbed] });
        target.send({ embeds: [dmEmbed] }).catch(() => {
            interaction.reply("There was an error while sending a DM to the user.");
            setTimeout(() => interaction.deleteReply(), 5000)
        });
        return;
    }
}