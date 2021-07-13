import {Choice, Choices, Discord, Guild, Option, Slash} from "@typeit/discord";
import { CommandInteraction, GuildMember, MessageEmbed, MessageReaction, ReactionCollector, TextChannel, User } from "discord.js";
import { Main } from '../../../../Main'

enum ClassChoices {
     "Klasse 5a" = "Klasse 5A",
     "Klasse 5b" = "Klasse 5B",
     "Klasse 5c" = "Klasse 5C",
     "Klasse 6a" = "Klasse 6A",
     "Klasse 6b" = "Klasse 6B",
     "Klasse 6c" = "Klasse 6C",
     "Klasse 6d" = "Klasse 6D",
     "Klasse 7a" = "Klasse 7A",
     "Klasse 7b" = "Klasse 7B",
     "Klasse 7c" = "Klasse 7C",
     "Klasse 8a" = "Klasse 8A",
     "Klasse 8b" = "Klasse 8B",
     "Klasse 8c" = "Klasse 8C",
     "Klasse 9a" = "Klasse 9A",
     "Klasse 9b" = "Klasse 9B",
     "Klasse 9c" = "Klasse 9C",
     "Klasse 9d" = "Klasse 9D",
     "Stufe EF" = "Stufe EF",
     "Stufe Q1" = "Stufe Q1",
     "Stufe Q2" = "Stufe Q2"
    }

@Discord()
export abstract class Verify {
    @Slash("verify")
    @Guild("755432683579900035")
    async verify(
        @Option("Vorname", { description: "Dein Vorname", required: true })
        firstName: string,
        @Option("Nachname", { description: "Dein Nachname", required: true })
        surname: string,
        @Choices(ClassChoices)
        @Choice("Keine Klasse" , "Klasse/Stufe")
        @Option("Klasse", { description: "Deine Klasse oder Stufe", required: true })
        choice: ClassChoices,
        @Option("Spitzname", { description: "Dein optionaler Spitzname" })
        nickname: string,

        interaction: CommandInteraction,
    ) {
        const channel = Main.Client.channels.cache.get("863391600687317003");
        const user = interaction.user;
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setTitle(`Verification Request from ${firstName} ${surname}.`)
            .addField(`Name`, `${firstName} ${surname}`)
            .addField('Klasse o. Stufe', `${choice}`)
            .addField("Spitzname", nickname ?? "Kein Spitzname")


        await interaction.reply("Deine Verifizierungs-Anfrage wurde gesendet. :white_check_mark:")
        if (channel.isText) {
            const message = (await (<TextChannel> channel).send({ embeds: [embed] }))
            await message.react('✅')
            await message.react('⛔')

            /* const filter = (reaction: MessageReaction, user: User) => {
                return reaction.emoji.name === '✅' || reaction.emoji.name === '⛔' && user.id === interaction.guild.ownerId
            } */

            // TODO: fix collector not reacting to added reactions
            const collector: ReactionCollector = message.createReactionCollector()
            collector.on('collect', async (reaction: MessageReaction, user: User) => {
                console.log('inside event listener');
                console.log(collector.collected)
                
                if (reaction.emoji.name === '✅'/*  && reaction.count >= 2 */) {
                    console.log('inside if');
                    
                    const roleMember = interaction.guild.members.cache.find(member => member.id == interaction.user.id)
                    await roleMember.roles.add('755464917834006678')
                    await message.channel.send("The verification request has been accepted. :white_check_mark:")
                    await user.send(`Hallo, ${interaction.user.username}. \nDeine Verifizierungs-Anfrage für **${interaction.guild.name}** wurde angenommen. Du kannst nun den Server benutzen.`)
                }
            })
        }
    }
}