import { ButtonComponent, Discord, Guild, Permission, Slash, SlashChoice, SlashOption } from "discordx";
import { ButtonInteraction, CommandInteraction, GuildMember, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

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
};

let requestUser: GuildMember | undefined;
let embed = new MessageEmbed();
let embedMessage: Message;
let buttonReply: Message;
let row: MessageActionRow;

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
        @SlashOption("vorname", { description: "Dein Vorname", type: "STRING" })
        firstName: string,
        @SlashOption("nachname", { description: "Dein Nachname", type: "STRING" })
        surname: string,
        @SlashOption("klasse", { description: "Deine Klasse/Stufe", type: "STRING" })
        @SlashChoice(ClassChoices)
        choice: string,
        @SlashOption("spitzname", { description: "Dein optionaler Spitzname", type: "STRING" })
        nickname: string,

        interaction: CommandInteraction,
    ) {
        const { user } = interaction;

        requestUser = await interaction.guild?.members.fetch(user);
        if (!requestUser) return interaction.reply({ content: "There was an error while fetching your user.", ephemeral: true });

        if (requestUser.roles.cache.has("755464917834006678")) return interaction.reply({ content: `You've been already verified.`, ephemeral: true });

        const verificationChannel = interaction.guild?.channels.cache.get("863391600687317003");
        if (!verificationChannel || verificationChannel.type !== "GUILD_TEXT") return interaction.reply({ content: "There was an error while fetching the verification channel.", ephemeral: true });

        interaction.reply({ content: "Your request has been sent to the verification channel. Please wait for a response.", ephemeral: true });

        embed = new MessageEmbed()
            .setTimestamp()
            .setFooter(`Request issued by ${requestUser.displayName}`, requestUser.user.avatarURL({ dynamic: true }) ?? requestUser.user.defaultAvatarURL)
            .setColor("#B97425")
            .setThumbnail(requestUser.user.avatarURL({ dynamic: true }) ?? requestUser.user.defaultAvatarURL)
            .setTitle(`Verification Request by **${firstName} ${surname}**`)
            .setDescription(`Status: ${VerificationStatus.Pending}`)
            .addFields([
                { name: "Name", value: `${firstName} ${surname}` },
                { name: "Klasse o. Stufe", value: choice },
                { name: "Spitzname", value: nickname ?? "-" },
            ]);

        if (verificationChannel.isText()) {
            embedMessage = await verificationChannel.send({ embeds: [embed] })
        } else {
            return interaction.reply({ content: "There was an error while sending the verification request.", ephemeral: true });
        };

        const acceptButton = new MessageButton()
            .setCustomId("accept")
            .setDisabled(false)
            .setEmoji("✅")
            .setLabel("Accept")
            .setStyle("SUCCESS")

        const denyButton = new MessageButton()
            .setCustomId("deny")
            .setDisabled(false)
            .setEmoji("❌")
            .setLabel("Deny")
            .setStyle("DANGER")

        row = new MessageActionRow().addComponents([acceptButton, denyButton]);
        buttonReply = await embedMessage.reply({ content: "Click one of the buttons below to accept or deny the request.", components: [row] });

    };


    @ButtonComponent("accept", { guilds: ["755432683579900035"] })
    async accept(
        interaction: ButtonInteraction
    ) {
        if (requestUser) requestUser.roles.add("755464917834006678");

        const embedEdit = embed
            .setDescription(`Status: ${VerificationStatus.Accepted}`)
            .setColor("#00FF00");
        embedMessage.edit({ embeds: [embedEdit] });
        buttonReply.delete();
        interaction.reply({ content: "You've accepted the verification request.", ephemeral: true });
        return requestUser?.send(`Your verification request for **${interaction.guild?.name}** has been accepted.`);
    };

    @ButtonComponent("deny", { guilds: ["755432683579900035"] })
    async deny(
        interaction: ButtonInteraction
    ) {
        const embedEdit = embed
            .setDescription(`Status: ${VerificationStatus.Denied}`)
            .setColor("#FF0000");
        embedMessage.edit({ embeds: [embedEdit] });
        buttonReply.delete();
        interaction.reply({ content: "You've denied the verification request.", ephemeral: true });
        return requestUser?.send(`Sorry, your verification request for **${interaction.guild?.name}** has been denied.\nIf there's any objection, please try it again or reach out to <@463044315007156224> or <@428119121423761410>.`);
    };
};