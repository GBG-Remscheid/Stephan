import { Option, Slash } from "@typeit/discord";
import { CommandInteraction, User } from "discord.js";

export abstract class Genitals {
    @Slash("penis")
    penis(
        @Option("member", { description: "optional member" })
        member: User,

        interaction: CommandInteraction
    ) {
        console.log(member);
        interaction.reply(`${member.username}'s dick is cm long`)
    }

    @Slash("mumu")
    mumu(
        @Option("member", { description: "optional member" })
        member: User,

        interaction: CommandInteraction
    ) {
        interaction.reply(`${member.username}'s mumu is cm deep`)
    }
}
