import { Discord, Slash, SlashOption } from "discordx";
import { CommandInteraction } from "discord.js";
import { SpamMeta } from "discord-spams";

@Discord()
export abstract class ReportSpam {
    @Slash("report-spam-link", { description: "Add a link to the spam list" })
    report(
        @SlashOption("link", {
            description: "the link that should be added to them spam list",
            required: true,
            type: "STRING",
        })
        link: string,
        interaction: CommandInteraction
    ): Promise<void> {
        const urlRegex =
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&/=]*)/;

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
