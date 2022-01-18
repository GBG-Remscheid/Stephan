import { Discord, Permission, Slash } from "discordx";
import { CommandInteraction } from "discord.js";

@Discord()
@Permission({ id: "374590194034409472", permission: true, type: "USER" })
@Permission({ id: "463044315007156224", permission: true, type: "USER" })
export abstract class Mel {
    @Slash("mel")
    mel(interaction: CommandInteraction): Promise<void> {
        return interaction.reply({
            content: "Mel & maggsii sind am tollsten <3",
            ephemeral: true,
        });
    }
}
