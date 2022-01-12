import { Category } from '@discordx/utilities';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import type { Snowflake } from 'discord-api-types';
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx';


@Discord()
@Category("Information")
@SlashGroup("info")
export abstract class UserInfo {
    @Slash("user")
    async userInfo(
        @SlashOption("user", { description: "The user you want to get information about", required: false, type: 'USER' })
        target: Snowflake,

        interaction: CommandInteraction
    ) {
        const { member, guild } = interaction;

        let targetMember: GuildMember | null = null;
        if (guild) targetMember = target ? await guild.members.fetch(target) : <GuildMember>member;
        if (!targetMember) return interaction.reply({ content: "There was an error while fetching the user.", ephemeral: true });

        const embed = new MessageEmbed()
            .setTimestamp()
            .setColor("RANDOM")
            .setThumbnail(targetMember.user.displayAvatarURL({ dynamic: true }) ?? targetMember.user.defaultAvatarURL)
            .setFooter({ text: `Requested by ${targetMember.user.tag}`, iconURL: targetMember.user.displayAvatarURL() ?? targetMember.user.defaultAvatarURL })
            .setTitle(`Information about **${targetMember.user.tag}**`)
            .addFields([
                { name: "Username", value: targetMember.user.tag },
                { name: "ID", value: targetMember.user.id, inline: true },
                { name: "Nickname", value: targetMember.nickname ?? "none" },
                { name: "Account Creation:", value: `<t:${(targetMember.user.createdTimestamp / 1000).toFixed(0)}:R>`, inline: true },
                { name: "Joined Server", value: `<t:${(targetMember.joinedTimestamp! / 1000).toFixed(0)}:R>` },
                { name: "Server Avatar", value: targetMember.avatar ? `[Link to avatar](${targetMember.avatarURL({ dynamic: true })})` : "none" },
                { name: "Global Avatar", value: `[Link to avatar](${targetMember.user.avatarURL({ dynamic: true }) ?? targetMember.user.defaultAvatarURL})` },
            ])

        interaction.reply({ embeds: [embed] });
    }
}