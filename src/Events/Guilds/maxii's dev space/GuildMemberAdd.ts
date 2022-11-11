import { ChannelType, PermissionFlagsBits } from "discord.js";
import { type ArgsOf, Discord, Guild, On } from "discordx";

@Discord()
@Guild("1003607488928686121")
export abstract class GuildMemberAdd {
    @On({ event: "guildMemberAdd" })
    async handler([member]: ArgsOf<"guildMemberAdd">): Promise<void> {
        const { guild } = member;
        const statChannel = guild.channels.cache.find(channel =>
            channel.name.includes(":bar_chart: members:"),
        );
        if (statChannel?.type !== ChannelType.GuildVoice) {
            console.warn(
                `There is no voice channel for displaying the members size...
            Trying to create one...`,
            );
        }

        if (!statChannel) {
            const memberCount = (await guild.members.fetch()).size;
            await guild.channels.create({
                name: `:bar_chart: Members: ${memberCount}`,
                permissionOverwrites: [
                    { deny: [PermissionFlagsBits.Connect], id: guild.id },
                ],
                position: 1,
                type: ChannelType.GuildVoice,
            });
        } else {
            const memberCount = (await guild.members.fetch()).size;
            await statChannel.edit({
                name: `:bar_chart: Members: ${memberCount}`,
            });
        }
    }
}
