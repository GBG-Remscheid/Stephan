import { Category } from "@discordx/utilities";
import type { GuildMember, InteractionResponse } from "discord.js";
import {
    ApplicationCommandOptionType,
    // UserContextMenuInteraction,
    CommandInteraction,
    EmbedBuilder,
} from "discord.js";
import { Snowflake } from "discord-api-types/v10";
import {
    // ContextMenu,
    Discord,
    Guard,
    Slash,
    SlashGroup,
    SlashOption,
} from "discordx";

import { NotGuild } from "../../../Guards/Global/NotGuild.js";

@Discord()
@Category("Information")
@Guard(NotGuild)
@SlashGroup({ name: "info" })
export abstract class UserInfo {
    @Slash({ name: "user" })
    @SlashGroup("info")
    async userInfo(
        @SlashOption({
            description: "The user you want to get information about",
            name: "user",
            required: false,
            type: ApplicationCommandOptionType.User,
        })
        target: Snowflake,

        interaction: CommandInteraction
    ): Promise<InteractionResponse<boolean>> {
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
        let joinedTimestamp: number;
        if (targetMember.joinedTimestamp) {
            joinedTimestamp = targetMember.joinedTimestamp;
        } else {
            return interaction.reply({
                content: "This user is not a member of this server anymore.",
                ephemeral: true,
            });
        }

        const embed = new EmbedBuilder()
            .setTimestamp()
            .setColor("Random")
            .setThumbnail(
                targetMember.user.displayAvatarURL() ??
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
                    value: `<t:${(joinedTimestamp / 1000).toFixed(0)}:R>`,
                },
                {
                    name: "Server Avatar",
                    value: targetMember.avatar
                        ? `[Link to avatar](${targetMember.avatarURL()})`
                        : "none",
                },
                {
                    name: "Global Avatar",
                    value: `[Link to avatar](${
                        targetMember.user.avatarURL() ??
                        targetMember.user.defaultAvatarURL
                    })`,
                },
            ]);

        return interaction.reply({ embeds: [embed] });
    }

    // @ContextMenu("USER", "User info")
    // info(interaction: UserContextMenuInteraction): void {
    //     const {} = interaction;
    //     const target = interaction.targetMember;
    // }
}
