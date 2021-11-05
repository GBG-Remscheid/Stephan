import { ButtonComponent, Discord, Guild, Permission, Slash, SlashChoice, SlashOption } from "discordx";
import { ButtonInteraction, CommandInteraction, GuildMember, MessageActionRow, MessageButton, MessageEmbed, Snowflake, TextChannel } from "discord.js";

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

const me: Snowflake = "463044315007156224";
const maggsi: Snowflake = '428119121423761410';

const embed = new MessageEmbed()

const enum VerificationStatus {
    Denied = "Denied ❌",
    Accepted = "Accepted ✅",
    Pending = "Pending 🕐"
}
@Discord()
@Permission({ id: "755464917834006678", type: "ROLE", permission: false })
@Permission({ id: '463044315007156224', type: "USER", permission: true })
@Permission({ id: '428119121423761410', type: "USER", permission: true })
export abstract class Verify {
    @Slash("verify")
    @Guild("755432683579900035")
    async verify(
        @SlashOption("vorname", { description: "Dein Vorname", required: true, type: "STRING" })
        firstName: string,
        @SlashOption("nachname", { description: "Dein Nachname", required: true, type: "STRING" })
        surname: string,
        @SlashOption("klasse", { description: "Deine Klasse/Stufe", required: true, type: "STRING" })
        @SlashChoice(ClassChoices)
        choice: string,
        @SlashOption("spitzname", { description: "Dein optionaler Spitzname", type: "STRING" })
        nickname: string,

        interaction: CommandInteraction,
    ) {
        const user = interaction.user;
        const member: GuildMember = await interaction.guild.members.fetch(user);
        if (member.roles.cache.has("755464917834006678")) return interaction.reply({ content: `You've been already verified.`, ephemeral: true })
        const channel = interaction.guild.channels.cache.get("863391600687317003");
        embed
            .setColor("RANDOM")
            .setTimestamp()
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setTitle(`Verification Request from ${firstName} ${surname}.`)
            .addField(`Name`, `${firstName} ${surname}`)
            .addField('Klasse o. Stufe', `${choice}`)
            .addField("Spitzname", nickname ?? "Kein Spitzname")
            .setDescription(`**Status**: ${VerificationStatus.Pending}`)

        const acceptButton = new MessageButton()
            .setLabel("Accept")
            .setEmoji("✅")
            .setStyle("SUCCESS")
            .setCustomId("accept-button")

        const denyButton = new MessageButton()
            .setLabel("Deny")
            .setEmoji("🚫")
            .setStyle("DANGER")
            .setCustomId("deny-button")

        const row = new MessageActionRow().addComponents([acceptButton, denyButton])

        interaction.reply("Deine Verifizierungs-Anfrage wurde gesendet. :white_check_mark:");
        setTimeout(() => interaction.deleteReply(), 5000)
        const messageEmbed = await (<TextChannel>channel).send({ embeds: [embed] });

        const filter = ((i: ButtonInteraction) => {
            i.deferUpdate();
            return i.user.id === me || i.user.id === maggsi;
        });

        const collector = messageEmbed.createMessageComponentCollector({ filter, componentType: "BUTTON", time: 10000 })
        collector.on("collect", (i: ButtonInteraction) => {
            i.reply(`${i.user.username} clicked the button.`)
        })

        messageEmbed.reply({ content: "Click the buttons to accept or deny the request.", components: [row] })

    }


    @ButtonComponent("accept-button", { guilds: ['755432683579900035'] })
    async accBtn(
        interaction: ButtonInteraction,
    ) {
        //TODO: Finish accept button component
        const member: GuildMember = await interaction.guild.members.fetch(interaction.user);
        member.roles.add("755464917834006678");
        // embed.setDescription(`**Status**: ${VerificationStatus.Accepted}`)
        interaction.user.send(`Your verification request for **${interaction.guild.name}** has been accepted.`);
        // setTimeout(() => interaction.reply("Request accepted"), 5000);
    }

    @ButtonComponent("deny-button", { guilds: ['755432683579900035'] })
    denyBtn(
        interaction: ButtonInteraction,
    ) {
        //TODO: Finish deny button component
        embed.setDescription(`**Status**: ${VerificationStatus.Denied}`)
        setTimeout(() => interaction.reply("Request denied"), 5000);
        interaction.user.send(`Sorry, your verification request for **${interaction.guild.name}** has been denied.\nIf there's any objection, please try it again or reach out to <@463044315007156224> or <@428119121423761410>.`)
    }
}