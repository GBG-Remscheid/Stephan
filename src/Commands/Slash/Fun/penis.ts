import { Discord, Group, Guild, Option, Slash } from "@typeit/discord";
import { CommandInteraction, User } from "discord.js";


@Discord()
@Guild("768975702187704360")
@Group(
    "genitals",
    "how long/deep are your genitals",
    {
        penis: "how long is your dick 8===D",
        mumu: "how deep is your mumu"
    }
)

export abstract class Genitals {
    @Slash("penis")
    @Group("penis")
    penis(
        @Option("member", { description: "optional member" })
        member: User,

        interaction: CommandInteraction
    ) {
        console.log(member);
        interaction.reply(`${member.username}'s dick is cm long`)
    }

    @Slash("mumu")
    @Group("mumu")
    mumu(
        @Option("member", { description: "optional member" })
        member: User,

        interaction: CommandInteraction
    ) {
        interaction.reply(`${member.username}'s mumu is cm deep`)
    }
}
