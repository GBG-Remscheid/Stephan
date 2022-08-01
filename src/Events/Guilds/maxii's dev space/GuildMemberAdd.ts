import { ChannelType, PermissionFlagsBits } from "discord.js";
import { type ArgsOf, Discord, Guild, On } from "discordx";

@Discord()
@Guild("1003607488928686121")
export abstract class GuildMemberAdd {
    @On("guildMemberAdd")
    async handler([member]: ArgsOf<"guildMemberAdd">): Promise<void> {
        const { guild } = member;
        const channel = guild.channels.cache.find(channel =>
            channel.name.includes(":bar_chart: members:")
        );
        if (channel?.type !== ChannelType.GuildVoice) {
            console.warn(
                `There is no voice channel for displaying the memebers size...
            Trying to create one...`
            );
        }

        if (!channel) {
            const memberCount = (await guild.members.fetch()).size;
            await guild.channels.create({
                name: `:bar_chart: Members: ${memberCount}`,
                type: ChannelType.GuildVoice,
                position: 1,
                permissionOverwrites: [
                    { deny: [PermissionFlagsBits.Connect], id: guild.id },
                ],
            });
        } else {
            const memberCount = (await guild.members.fetch()).size;
            await channel.edit({ name: `:bar_chart: Members: ${memberCount}` });
        }
    }
}
