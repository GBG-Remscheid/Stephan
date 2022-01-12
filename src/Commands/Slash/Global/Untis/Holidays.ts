import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, Slash, SlashGroup } from "discordx";
import Webuntis from 'webuntis';
import { config } from 'dotenv';
import moment from "moment";
import { Category } from "@discordx/utilities";

config();

const untis = new Webuntis(process.env.SCHOOL ?? "", process.env.USERNAME ?? "", process.env.PASSWORD ?? "", process.env.BASEURL ?? "");

@Discord()
@Category("Untis")
@SlashGroup("untis")
export default class Holidays {
    @Slash("ferien")
    async holidays(
        interaction: CommandInteraction
    ) {
        untis.login()
            .then(async () => {
                let daysLeft: string = "";
                let date: Date = new Date();
                const startDate = (await untis.getHolidays()).at(1)?.startDate;

                const dateString = startDate?.toString();
                const year = dateString?.substring(0, 4);
                const month = dateString?.substring(4, 6);
                const day = dateString?.substring(6, 8);

                if (year && month && day) {
                    date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                }
                daysLeft = moment.duration(date.valueOf() - new Date().valueOf()).asDays().toFixed(0);

                const embed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setDescription(`Die Ferien beginnen in ${daysLeft} Tagen`);

                interaction.reply({ embeds: [embed] });
            })
    }
}