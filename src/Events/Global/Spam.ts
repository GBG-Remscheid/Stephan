import { type ArgsOf, Discord, On } from "discordx";
import { SpamMeta } from "discord-spams";

@Discord()
export abstract class Spam {
    lastUpdate: number | null = null;

    @On({ event: "messageCreate" })
    async handler([message]: ArgsOf<"messageCreate">): Promise<void> {
        if (!message.guild || !message.member || message.author.bot) {
            return;
        }

        if (!this.lastUpdate || Date.now() - this.lastUpdate > 5 * 60 * 1000) {
            await SpamMeta.refreshMasterList();
            this.lastUpdate = Date.now();
        }

        if (SpamMeta.isSpam(message.content)) {
            await message.delete().catch((error: Error) => {
                console.error(error);
                message.channel.send(
                    "There was an error while deleting the spam message."
                );
                setTimeout(() => message.delete(), 5000);
            });

            const isMuted = await message.member
                .disableCommunicationUntil(
                    Date.now() + 6 * 60 * 60 * 1000,
                    "Spam message detected"
                )
                .catch((error: Error) => {
                    console.error(error);
                });

            if (isMuted) {
                message.channel.send(
                    `:mute: ${message.author} has been muted for 6 hours for sending a spam link.`
                );
            } else {
                message.channel.send(
                    `:cold_face: Spam message detected from ${message.author}, please allow me to mute members!`
                );
            }
        }
    }
}
