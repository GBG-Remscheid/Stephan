import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, Slash, SlashChoice, SlashGroup, SlashOption } from "discordx";
import { container, injectable } from "tsyringe";
import { Env } from "../../../../Utils/Env.js";
import { Lesson } from "webuntis";

const Klassen = [
    { name: "5a", value: "296" },
    { name: "5b", value: "301" },
    { name: "5c", value: "306" },
    { name: "6a", value: "311" },
    { name: "6b", value: "316" },
    { name: "6c", value: "321" },
    { name: "6d", value: "326" },
    { name: "7a", value: "331" },
    { name: "7b", value: "336" },
    { name: "7c", value: "341" },
    { name: "8a", value: "346" },
    { name: "8b", value: "351" },
    { name: "8c", value: "356" },
    { name: "9a", value: "366" },
    { name: "9b", value: "371" },
    { name: "9c", value: "376" },
    { name: "EF", value: "401" },
    { name: "Q1", value: "466" },
    { name: "Q2", value: "481" },
];

const Tag = [
    { name: "heute", value: "heute" },
    { name: "morgen", value: "morgen" },
];

const formatLessonTime = (lesson: Lesson) => {
    const start = lesson.startTime;
    switch (start.toString()) {
        case "745":
            return "1. Std.";
        case "835":
            return "2. Std.";
        case "940":
            return "3. Std.";
        case "1030":
            return "4. Std.";
        case "1130":
            return "5. Std.";
        case "1220":
            return "6. Std.";
        case "1310":
            return "7. Std.";
        case "1400":
            return "8. Std.";
        case "1450":
            return "9. Std.";
        case "1600":
            return "10. Std.";
        default:
            return "---";
    }
};

@Discord()
@SlashGroup({ description: "utils to get infos from untis", name: "untis" })
@injectable()
export class Vertretung {
    constructor(private readonly env: Env) {}

    private formatLessonName = (name: string | undefined) => {
        const regex = RegExp(/_(([E-Q]|[5-9])([1-2]|[a-d]|F)){1,4}/g);
        return name?.replace(regex, "");
    };

    @Slash("vertretung")
    @SlashGroup("untis")
    // FIXME: Raumtausch still doesn't work
    async vertretung(
        @SlashOption("klasse")
        @SlashChoice(...Klassen)
        klasse: string,

        @SlashOption("tag", {
            description: "Abfragetag (heute oder morgen)",
            type: "STRING",
        })
        @SlashChoice(...Tag)
        tag: string,

        interaction: CommandInteraction
    ): Promise<void> {
        const untis = container.resolve(Env).untis;

        await interaction.deferReply();

        let timetable: Lesson[];

        const embed = new MessageEmbed()
            .setTimestamp()
            .setThumbnail("https://gbgrs.de/images/logo/gbglogo1024.png")
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
                if (tag === Tag[0].value) {
                    timetable = await untis.getTimetableForToday(
                        parseInt(klasse),
                        1
                    );
                } else if (tag === Tag[1].value) {
                    const date = new Date();
                    const tomorrow = date.setDate(date.getDate() + 1);
                    const tomorrowDate = new Date(tomorrow);

                    timetable = await untis.getTimetableFor(
                        tomorrowDate,
                        parseInt(klasse),
                        1
                    );
                } else {
                    interaction.reply({
                        content:
                            "Die Infos zum Stundenplan konnten nicht abgerufen werden.",
                        ephemeral: true,
                    });
                }

                const ausfall = timetable.filter(lesson => lesson.substText);
                const raumtausch = timetable.filter(
                    lesson => lesson.ro.length > 1
                );
                console.log(
                    ausfall.map(
                        lesson =>
                            `${lesson.startTime}: ${lesson.su.map(
                                subject => subject.name
                            )}`
                    )
                );

                if (ausfall.map(lesson => lesson.substText).length > 0) {
                    embed.setTitle(
                        `${
                            tag === Tag[0].value ? "Heute" : "Morgen"
                        } entfällt der Unterricht für:`
                    );
                    ausfall.map(lesson => {
                        embed
                            .addField(
                                "Stunde",
                                `\`\`\`${formatLessonTime(lesson)}\`\`\``,
                                true
                            )
                            .addField(
                                "Fach",
                                `\`\`\`${
                                    this.formatLessonName(lesson.sg) ??
                                    lesson.su.map(l => l.name) ??
                                    "N/A"
                                }\`\`\``,
                                true
                            )
                            // .addField(
                            //     "Lehrer",
                            //     `\`\`\`${lesson.te.map(
                            //         teacher => teacher.name
                            //     )}\`\`\``,
                            //     true
                            // )
                            .addField(
                                "Anmerkung",
                                `\`\`\`${lesson.substText ?? "N/A"}\`\`\``,
                                true
                            )
                            .addField("\u200B", "\u200B");
                        /* Alternative design idea */
                        // embed.addField("Fach", "Grund", true)
                        //     .addField(`\`${lesson.sg ?? ""}\``, `\`${lesson.substText ?? ""}\``, true)
                        //     .addField('\u200B', '\u200B', true)
                    });
                    interaction.editReply({ embeds: [embed] });
                } else {
                    embed.setDescription(
                        `${
                            tag === Tag[0].value ? "Heute" : "Morgen"
                        } fällt bei dir nichts aus! 🕙`
                    );
                    interaction.editReply({ embeds: [embed] });
                }

                if (raumtausch.length > 0) {
                    embed.addField(
                        "Außerdem gibt es Raumtausch für:",
                        "\u200B"
                    );
                    raumtausch.map(aLesson => {
                        embed
                            .addField(
                                "Fach",
                                `\`\`\`${
                                    this.formatLessonName(aLesson.sg) ??
                                    aLesson.su.map(l => l.name) ??
                                    "N/A"
                                }\`\`\``
                            )
                            .addField(
                                "Raum",
                                `\`\`\`${aLesson.ro[0].name} --> ${aLesson.ro[1].name}\`\`\``,
                                true
                            );
                    });
                }
            })
            .catch((err: Error) => console.error(err));
    }
}
