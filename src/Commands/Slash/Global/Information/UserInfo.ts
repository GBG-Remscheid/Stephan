import {
    CommandInteraction,
    GuildMember,
    MessageEmbed,
    // UserContextMenuInteraction,
} from "discord.js";
import {
    // ContextMenu,
    Discord,
    Guard,
    Slash,
    SlashGroup,
    SlashOption,
} from "discordx";
import { Category } from "@discordx/utilities";
import { NotGuild } from "../../../../Guards/Global/NotGuild.js";
import type { Snowflake } from "discord-api-types";

@Discord()
@Category("Information")
@Guard(NotGuild)
@SlashGroup({ name: "info" })
export abstract class UserInfo {
    @Slash("user")
    @SlashGroup("info")
    async userInfo(
        @SlashOption("user", {
            description: "The user you want to get information about",
            required: false,
            type: "USER",
        })
        target: Snowflake,

        interaction: CommandInteraction
    ): Promise<void> {
        const { member, guild } = interaction;

        let targetMember: GuildMember | null = null;
        if (guild) {
            targetMember = target
                ? await guild.members.fetch(target)
                : <GuildMember>member;
        }
        if (!targetMember) {
            return interaction.reply({
                content: "There was an error while fetching the user.",
                ephemeral: true,
            });
        }

        const embed = new MessageEmbed()
            .setTimestamp()
            .setColor("RANDOM")
            .setThumbnail(
                targetMember.user.displayAvatarURL({ dynamic: true }) ??
                    targetMember.user.defaultAvatarURL
            )
            .setFooter({
                iconURL:
                    targetMember.user.displayAvatarURL() ??
                    targetMember.user.defaultAvatarURL,
                text: `Requested by ${targetMember.user.tag}`,
            })
            .setTitle(`Information about **${targetMember.user.tag}**`)
            .addFields([
                { name: "Username", value: targetMember.user.tag },
                { inline: true, name: "ID", value: targetMember.user.id },
                { name: "Nickname", value: targetMember.nickname ?? "none" },
                {
                    inline: true,
                    name: "Account Creation:",
                    value: `<t:${(
                        targetMember.user.createdTimestamp / 1000
                    ).toFixed(0)}:R>`,
                },
                {
                    name: "Joined Server",
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    value: `<t:${(targetMember.joinedTimestamp! / 1000).toFixed(
                        0
                    )}:R>`,
                },
                {
                    name: "Server Avatar",
                    value: targetMember.avatar
                        ? `[Link to avatar](${targetMember.avatarURL({
                              dynamic: true,
                          })})`
                        : "none",
                },
                {
                    name: "Global Avatar",
                    value: `[Link to avatar](${
                        targetMember.user.avatarURL({ dynamic: true }) ??
                        targetMember.user.defaultAvatarURL
                    })`,
                },
            ]);

        interaction.reply({ embeds: [embed] });
    }

    // @ContextMenu("USER", "User info")
    // info(interaction: UserContextMenuInteraction): void {
    //     const {} = interaction;
    //     const target = interaction.targetMember;
    // }
}
