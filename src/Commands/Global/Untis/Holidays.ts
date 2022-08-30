import { Category } from "@discordx/utilities";
import type { CommandInteraction } from "discord.js";
import { EmbedBuilder } from "discord.js";
import { Discord, Slash, SlashGroup } from "discordx";
import moment from "moment";
import { container, injectable } from "tsyringe";

import { Env } from "../../../Utils/Env.js";

@Discord()
@Category("Untis")
@SlashGroup({ description: "utils to get infos from untis", name: "untis" })
@injectable()
export class Holidays {
    constructor(private readonly env: Env) {}

    @Slash({
        description: "Get the days util the next holidays",
        descriptionLocalizations: {
            de: "Erfahre die Tage bis zur nächsten Ferien",
        },
        name: "holidays",
        nameLocalizations: { de: "ferien" },
    })
    @SlashGroup("untis")
    holidays(interaction: CommandInteraction): void {
        const untis = container.resolve(Env).untis;
        untis.login().then(async () => {
            let date: Date = new Date();
            const startDate = (await untis.getHolidays()).at(6)?.startDate;

            const dateString = startDate?.toString();
            const year = dateString?.substring(0, 4);
            const month = dateString?.substring(4, 6);
            const day = dateString?.substring(6, 8);

            if (year && month && day) {
                date = new Date(
                    parseInt(year),
                    parseInt(month) - 1,
                    parseInt(day)
                );
            }
            const daysLeft = moment
                .duration(date.valueOf() - new Date().valueOf())
                .asDays()
                .toFixed(0);

            const embed = new EmbedBuilder()
                .setColor("Random")
                .setDescription(`Die Ferien beginnen in ${daysLeft} Tagen`);

            return interaction.reply({ embeds: [embed] });
        });
    }
}
