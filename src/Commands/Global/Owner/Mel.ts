import type { InteractionResponse } from "discord.js";
import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
/* import moment from "moment"; */

@Discord()
// @Permission(false)
// @Permission({ id: "374590194034409472", permission: true, type: "USER" })
// @Permission({ id: "463044315007156224", permission: true, type: "USER" })
export abstract class Mel {
    @Slash({ description: "<3", name: "mel" })
    mel(
        interaction: CommandInteraction
    ): Promise<InteractionResponse<boolean>> {
        // days until 24.02.2022
        /* const daysLeft = moment("2022-02-24").diff(moment(), "days"); */

        const catGIFs = [
            "https://c.tenor.com/JRFXgb1TBx8AAAAC/cat-cats.gif",
            "https://i.imgur.com/r8SbhWp.gif",
            "https://c.tenor.com/RiHiEx9u-r0AAAAC/cat-hug.gif",
            "https://c.tenor.com/rgJqc4unaUYAAAAC/love-you.gif",
            "https://i.imgur.com/gQ2m7cl.gif",
            "https://c.tenor.com/qLL-xoCauUYAAAAC/peachcat-kiss.gif",
            "https://c.tenor.com/5iSOvaJG7MQAAAAC/lady-and-the-tramp.gif",
            "https://c.tenor.com/whAhQj8irG8AAAAC/lady-and-the-tramp-dogs.gif",
        ];

        const randomGIF = catGIFs[Math.floor(Math.random() * catGIFs.length)];
        return interaction.reply({
            content: "mel & maggsii sind am tollsten <3",
            ephemeral: true,
            files: [randomGIF],
        });

        /* if (daysLeft === 69) {
            return interaction.reply({
                content:
                    "Mel & maggsii sind am tollsten <3 \nHeute sehen wir uns. <33333",
                ephemeral: true,
                files: [randomGIF],
            });
        } else if (daysLeft > 69) {
            return interaction.reply({
                content: `Mel & maggsii sind am tollsten <3 \nWir haben uns gesehen vor \`69\` - ${
                    69 + daysLeft
                } Tagen. <33333`,
                ephemeral: true,
                files: [randomGIF],
            });
        } else {
            return interaction.reply({
                content: `Mel & maggsii sind am tollsten <3 \nNoch \`69\` - ${
                    69 - daysLeft
                } Tage bis wir uns sehen. <33333`,
                ephemeral: true,
                files: [randomGIF],
            });
        } */
    }
}
