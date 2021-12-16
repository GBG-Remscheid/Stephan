import type { Snowflake } from "discord-api-types";
import { CommandInteraction, GuildMember, MessageEmbed, Permissions, Role, TextChannel } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import moment from "moment";

@Discord()
@SlashGroup("mod")
export abstract class Mute {
    @Slash("mute", { description: "Mute a specific user on your server for a specific time." })
    async mute(
        @SlashOption("user", { description: "The user you'd like to mute", required: true, type: "USER" })
        targetId: Snowflake,

        @SlashOption("reason", { description: "The reason for your mute", required: true, type: "STRING" })
        reason: string,

        @SlashOption("days", { description: "The duration for your mute", required: false, type: "INTEGER" })
        duration: number,


        interaction: CommandInteraction
    ) {
        const { channel, createdAt, guild, member, user } = interaction;
        if (!guild) return interaction.reply({ content: "Your server couldn't be fetched while executing your interaction.", ephemeral: true });

        const target = await guild.members.fetch(targetId);
        if (!target) return interaction.reply({ content: "There was an error while fetching the user.", ephemeral: true });

        let mDuration: moment.Duration;
        let milliseconds: number;

        let muterole = guild.roles.cache.find(muterole => muterole.name === 'Muted');

        if (!muterole) {
            try {
                muterole = await guild.roles.create({

                    name: 'Muted',
                    color: '#818386',
                    permissions: []
                });
                guild.channels.cache.forEach(async (channel) => {
                    if (channel instanceof TextChannel) {
                        await channel.permissionOverwrites.create((<Role>muterole), {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false
                        });
                    }
                    return
                });
            } catch (error) {
                if (error instanceof Error) return console.error(error);
            }
        }

        if (!(<GuildMember>member).permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return interaction.reply({ content: "You don't have `MANAGE_MESSAGES` permissions to use this command.", ephemeral: true });

        if (target.user.bot) return interaction.reply({ content: "You can't mute a bot.", ephemeral: true });
        if (target === member) return interaction.reply({ content: "You can't mute yourself.", ephemeral: true });
        if (target.id === guild.ownerId) return interaction.reply({ content: "You can't mute the server owner.", ephemeral: true });


        const serverEmbed = new MessageEmbed()
            .setAuthor("Mute Info", target.user.displayAvatarURL({ dynamic: true }))
            .setColor("#FF0C00")
            .setFooter(`Mute executed by ${user.username}`, user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .addFields([
                { name: '**Muted User:**', value: `${target.user}` },
                { name: '**Target ID:**', value: `\`${target.id}\``, inline: true },
                { name: '**Muted By:**', value: `${user}` },
                { name: '**User ID:**', value: `\`${user.id}\``, inline: true },
                { name: '**Mute Reason:**', value: `\`${reason}\`` },
                { name: '**Mute Time:**', value: `\`${moment(createdAt).format('DD. MMMM YYYY, HH:mm')}\`` },
                { name: '**Channel:**', value: `${channel}` },
                { name: '**Mute Duration:**', value: `${duration ? `${duration} day(s)` : 'Infinite'}`, inline: true }
            ])

        const dmEmbed = new MessageEmbed()
            .setAuthor(`Your Mute Info`, target.user.displayAvatarURL({ dynamic: true }))
            .setColor('#FF0C00')
            .setFooter(`Mute executed by ${user.username}`, user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setDescription(
                `**You have been muted on ${guild.name}**\n`,
            )
            .addField("**Reason:**", `${reason}`);

        interaction.reply({ embeds: [serverEmbed] })
        target.send({ embeds: [dmEmbed] }).catch(() => {
            interaction.reply("There was an error while sending a DM to the user.");
            setTimeout(() => interaction.deleteReply(), 5000)
        })
        if (duration && muterole) {

            mDuration = moment.duration(duration, 'days');
            milliseconds = mDuration.asMilliseconds();

            target.roles.add(muterole).catch(() => {
                interaction.reply("There was an error while adding the muterole.");
                setTimeout(() => interaction.deleteReply(), 5000)
            });
            setTimeout(() => target.roles.remove(muterole as Role).catch(() => {
                interaction.reply("There was an error while removing the muterole.");
                setTimeout(() => interaction.deleteReply(), 5000)
            }), milliseconds);
        } else if (muterole) {
            target.roles.add(muterole);
        }
        return
    }
}