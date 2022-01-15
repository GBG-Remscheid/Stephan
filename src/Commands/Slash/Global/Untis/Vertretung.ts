import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, Slash, SlashChoice, SlashGroup, SlashOption } from "discordx";
import WebUntis, { Lesson } from "webuntis";
import { config } from "dotenv";
config();

enum Klassen {
    "5a" = "296",
    "5b" = "301",
    "5c" = "306",
    "6a" = "311",
    "6b" = "316",
    "6c" = "321",
    "6d" = "326",
    "7a" = "331",
    "7b" = "336",
    "7c" = "341",
    "8a" = "346",
    "8b" = "351",
    "8c" = "356",
    "9a" = "366",
    "9b" = "371",
    "9c" = "376",
    "EF" = "401",
    "Q1" = "466",
    "Q2" = "481",
}

enum Tag {
    heute = "heute",
    morgen = "morgen",
}

const untis = new WebUntis(
    process.env.SCHOOL ?? "",
    process.env.USERNAME ?? "",
    process.env.PASSWORD ?? "",
    process.env.BASEURL ?? ""
);

const formatLessonName = (name: string | undefined) => {
    const regex = RegExp(/_(([E-Q]|[5-9])([1-2]|[a-d]|F)){1,4}/g);
    return name?.replace(regex, "");
};

@Discord()
@SlashGroup("untis")
export abstract class Vertretung {
    @Slash("vertretung")
    // FIXME: Raumtausch still doesn't work
    async vertretung(
        @SlashOption("klasse")
        @SlashChoice(Klassen)
        klasse: string,

        @SlashOption("tag", {
            description: "Abfragetag (heute oder morgen)",
            type: "STRING",
        })
        @SlashChoice(Tag)
        tag: string,

        interaction: CommandInteraction
    ): Promise<void> {
        await interaction.deferReply();

        let timetable: Lesson[];

        const embed = new MessageEmbed()
            .setTimestamp()
            .setThumbnail("https://neu.gbgrs.de/images/logo/gbglogo1024.png")
            .setURL("https://dsbmobile.de/")
            .setFooter({
                iconURL:
                    interaction.user.avatarURL({ dynamic: true }) ??
                    interaction.user.defaultAvatarURL,
                text: `Requested by ${interaction.user.username}`,
            })
            .setColor("RANDOM")
            .setAuthor({
                name: "Die Informationen von Untis können manchmal nicht stimmen. Frag am besten direkt bei deinem Fachlehrer nach, wenn du dir unsicher bist.",
            });

        untis
            .login()
            .then(async () => {
                if (tag === Tag.heute) {
                    timetable = await untis.getTimetableForToday(
                        parseInt(klasse),
                        1
                    );
                } else if (tag === Tag.morgen) {
                    const date = new Date();
                    const tommorow = date.setDate(date.getDate() + 1);
                    const tommorowDate = new Date(tommorow);

                    timetable = await untis.getTimetableFor(
                        tommorowDate,
                        parseInt(klasse),
                        1
                    );
                }

                const ausfall = timetable.filter(lesson => lesson.substText);
                console.log(ausfall.map(lesson => lesson.su));

                if (ausfall.map(lesson => lesson.substText).length > 0) {
                    embed.setTitle("Heute entfällt der der Unterricht für:");
                    ausfall.map(lesson => {
                        embed
                            .addField(
                                "Fach",
                                `\`\`\`${
                                    formatLessonName(lesson.sg) ??
                                    lesson.su.map(l => l.name) ??
                                    "N/A"
                                }\`\`\``,
                                true
                            )
                            .addField(
                                "Anmerkung",
                                `\`\`\`${lesson.substText ?? "N/A"}\`\`\``,
                                true
                            )
                            .addField("\u200B", "\u200B", true);
                        /* Alternative deisgn idea */
                        // embed.addField("Fach", "Grund", true)
                        //     .addField(`\`${lesson.sg ?? ""}\``, `\`${lesson.substText ?? ""}\``, true)
                        //     .addField('\u200B', '\u200B', true)
                    });
                    interaction.editReply({ embeds: [embed] });
                } else {
                    embed.setDescription("Heute fällt bei dir nichts aus! 🕙");
                    interaction.editReply({ embeds: [embed] });
                }
            })
            .catch(err => console.log(err));
    }
}
