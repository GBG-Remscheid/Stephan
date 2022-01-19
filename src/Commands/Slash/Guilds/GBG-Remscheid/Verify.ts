import {
    ButtonComponent,
    Discord,
    Guild,
    Permission,
    Slash,
    SlashChoice,
    SlashOption,
} from "discordx";
import {
    ButtonInteraction,
    CommandInteraction,
    GuildMember,
    Message,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
} from "discord.js";
import { Category } from "@discordx/utilities";

enum ClassChoices {
    "5a" = "813879297735262299",
    "5b" = "813879337530032188",
    "5c" = "813879359881740298",
    "5d" = "813879398763200554",
    "6a" = "813885168942841896",
    "6b" = "813885287611498527",
    "6c" = "813885359720235008",
    "6d" = "876828582775767041",
    "7a" = "813885651463700500",
    "7b" = "813885716727595018",
    "7c" = "813885764667572327",
    "7d" = "876851320458457160",
    "8a" = "813885864291074079",
    "8b" = "813885924106436658",
    "8c" = "813885977147736064",
    "8d" = "876851408958275655",
    "9a" = "876808321900871760",
    "9b" = "876866717454860299",
    "9c" = "876866762031915029",
    "9d" = "876851442093277224",
    "EF" = "755433966500184105",
    "Q1" = "755433930089431061",
    "Q2" = "876808753930965012",
}

let requestUser: GuildMember;
let aNickname: string;
let roleChoice: string;
let embed = new MessageEmbed();
let embedMessage: Message;
let buttonReply: Message;
let row: MessageActionRow;

const enum VerificationStatus {
    Accepted = "Accepted ✅",
    Denied = "Denied ❌",
    Pending = "Pending 🕐",
}
@Discord()
@Category("Utilities")
@Permission({ id: "755464917834006678", permission: false, type: "ROLE" })
@Permission({ id: "463044315007156224", permission: true, type: "USER" })
@Permission({ id: "428119121423761410", permission: true, type: "USER" })
export abstract class Verify {
    @Slash("verify")
    @Guild("755432683579900035")
    async verify(
        @SlashOption("vorname", { description: "Dein Vorname", type: "STRING" })
        firstName: string,
        @SlashOption("nachname", {
            description: "Dein Nachname",
            type: "STRING",
        })
        surname: string,
        @SlashOption("klasse", {
            description: "Deine Klasse/Stufe",
            type: "STRING",
        })
        @SlashChoice(ClassChoices)
        choice: string,
        @SlashOption("spitzname", {
            description: "Dein optionaler Spitzname",
            type: "STRING",
        })
        nickname: string,

        interaction: CommandInteraction
    ): Promise<void> {
        const { user } = interaction;
        aNickname = nickname;
        roleChoice = choice;

        if (interaction.guild) {
            requestUser = await interaction.guild.members.fetch(user);
        }
        if (!requestUser) {
            return interaction.reply({
                content: "There was an error while fetching your user.",
                ephemeral: true,
            });
        }

        if (requestUser.roles.cache.has("755464917834006678")) {
            return interaction.reply({
                content: "You've been already verified.",
                ephemeral: true,
            });
        }

        const verificationChannel =
            interaction.guild?.channels.cache.get("863391600687317003");
        if (!verificationChannel || verificationChannel.type !== "GUILD_TEXT") {
            return interaction.reply({
                content:
                    "There was an error while fetching the verification channel.",
                ephemeral: true,
            });
        }

        interaction.reply({
            content:
                "Your request has been sent to the verification channel. Please wait for a response.",
            ephemeral: true,
        });

        embed = new MessageEmbed()
            .setTimestamp()
            .setFooter({
                iconURL:
                    requestUser.user.avatarURL({ dynamic: true }) ??
                    requestUser.user.defaultAvatarURL,
                text: `Request issued by ${requestUser.displayName}`,
            })
            .setColor("#B97425")
            .setThumbnail(
                requestUser.user.avatarURL({ dynamic: true }) ??
                    requestUser.user.defaultAvatarURL
            )
            .setTitle(`Verification Request by **${firstName} ${surname}**`)
            .setDescription(`Status: ${VerificationStatus.Pending}`)
            .addFields([
                { name: "Name", value: `${firstName} ${surname}` },
                {
                    name: "Klasse o. Stufe",
                    value:
                        interaction.guild?.roles.cache.find(
                            r => r.id === choice
                        )?.name ?? "",
                },
                { name: "Spitzname", value: nickname ?? "-" },
            ]);

        if (verificationChannel.isText()) {
            embedMessage = await verificationChannel.send({ embeds: [embed] });
        } else {
            return interaction.reply({
                content:
                    "There was an error while sending the verification request.",
                ephemeral: true,
            });
        }

        const acceptButton = new MessageButton()
            .setCustomId("accept")
            .setDisabled(false)
            .setEmoji("✅")
            .setLabel("Accept")
            .setStyle("SUCCESS");

        const denyButton = new MessageButton()
            .setCustomId("deny")
            .setDisabled(false)
            .setEmoji("❌")
            .setLabel("Deny")
            .setStyle("DANGER");

        row = new MessageActionRow().addComponents([acceptButton, denyButton]);
        buttonReply = await embedMessage.reply({
            components: [row],
            content:
                "Click one of the buttons below to accept or deny the request.",
        });
    }

    @ButtonComponent("accept", { guilds: ["755432683579900035"] })
    accept(interaction: ButtonInteraction): Promise<void> {
        if (requestUser) {
            requestUser.roles.add("755464917834006678");
            if (
                interaction.guild?.roles.cache
                    .find(r => r.id === roleChoice)
                    ?.name.startsWith("5")
            ) {
                requestUser.roles.add("755434201301647380");
            } else if (
                interaction.guild?.roles.cache
                    .find(r => r.id === roleChoice)
                    ?.name.startsWith("6")
            ) {
                requestUser.roles.add("755434171458912356");
            } else if (
                interaction.guild?.roles.cache
                    .find(r => r.id === roleChoice)
                    ?.name.startsWith("7")
            ) {
                requestUser.roles.add("755434140534440076");
            } else if (
                interaction.guild?.roles.cache
                    .find(r => r.id === roleChoice)
                    ?.name.startsWith("8")
            ) {
                requestUser.roles.add("755434101141405797");
            } else if (
                interaction.guild?.roles.cache
                    .find(r => r.id === roleChoice)
                    ?.name.startsWith("9")
            ) {
                requestUser.roles.add("755434011190624307");
            }
            requestUser.roles.add(roleChoice);

            if (aNickname) {
                requestUser.setNickname(aNickname);
            }

            requestUser.send(
                `Your verification request for **${interaction.guild?.name}** has been accepted.`
            );
        }

        const embedEdit = embed
            .setDescription(`Status: ${VerificationStatus.Accepted}`)
            .setColor("#00FF00");
        embedMessage.edit({ embeds: [embedEdit] });
        buttonReply.delete();
        return interaction.reply({
            content: "You've accepted the verification request.",
            ephemeral: true,
        });
    }

    @ButtonComponent("deny", { guilds: ["755432683579900035"] })
    deny(interaction: ButtonInteraction): Promise<void> {
        if (requestUser) {
            requestUser.send(
                `Sorry, your verification request for **${interaction.guild?.name}** has been denied.\nIf there's any objection, please try it again or reach out to <@463044315007156224> or <@428119121423761410>.`
            );
        }

        const embedEdit = embed
            .setDescription(`Status: ${VerificationStatus.Denied}`)
            .setColor("#FF0000");
        embedMessage.edit({ embeds: [embedEdit] });
        buttonReply.delete();
        return interaction.reply({
            content: "You've denied the verification request.",
            ephemeral: true,
        });
    }
}
