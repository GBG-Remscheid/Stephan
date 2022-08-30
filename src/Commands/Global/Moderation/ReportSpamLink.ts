import { Category } from "@discordx/utilities";
import type { CommandInteraction, InteractionResponse } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { SpamMeta } from "discord-spams";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";

@Discord()
@Category("Moderation")
@SlashGroup({ description: "all kinds of moderation utils", name: "mod" })
export abstract class ReportSpam {
    @Slash({
        description: "Add a link to the spam list",
        name: "report-spam-link",
    })
    @SlashGroup("mod")
    report(
        @SlashOption({
            description: "the link that should be added to them spam list",
            name: "link",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        link: string,
        interaction: CommandInteraction
    ): Promise<InteractionResponse<boolean>> {
        const urlRegex =
            /https?:\/\/(www\.)?[-a-zA-Z\d@:%._+~#=]{1,256}\.[a-zA-Z\d()]{1,6}\b([-a-zA-Z\d()@:%_+.~#?&/=]*)/;

        if (link.match(urlRegex)) {
            SpamMeta.addLink(link);
            return interaction.reply("Link added to spam list");
        } else {
            return interaction.reply({
                content: "The provided link is not valid",
                ephemeral: true,
            });
        }
    }
}
