import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelType,
    CommandInteraction,
    EmbedBuilder,
    GuildMember,
    InteractionResponse,
    Message,
} from "discord.js";
import {
    ButtonComponent,
    Discord,
    Guild,
    Slash,
    SlashChoice,
    SlashOption,
} from "discordx";
import { Category } from "@discordx/utilities";

const classChoices = [
    { name: "5a", value: "813879297735262299" },
    { name: "5b", value: "813879337530032188" },
    { name: "5c", value: "813879359881740298" },
    { name: "5d", value: "813879398763200554" },
    { name: "6a", value: "813885168942841896" },
    { name: "6b", value: "813885287611498527" },
    { name: "6c", value: "813885359720235008" },
    { name: "6d", value: "876828582775767041" },
    { name: "7a", value: "813885651463700500" },
    { name: "7b", value: "813885716727595018" },
    { name: "7c", value: "813885764667572327" },
    { name: "7d", value: "876851320458457160" },
    { name: "8a", value: "813885864291074079" },
    { name: "8b", value: "813885924106436658" },
    { name: "8c", value: "813885977147736064" },
    { name: "8d", value: "876851408958275655" },
    { name: "9a", value: "876808321900871760" },
    { name: "9b", value: "876866717454860299" },
    { name: "9c", value: "876866762031915029" },
    { name: "9d", value: "876851442093277224" },
    { name: "EF", value: "755433966500184105" },
    { name: "Q1", value: "755433930089431061" },
    { name: "Q2", value: "876808753930965012" },
];

let requestUser: GuildMember;
let aNickname: string;
let roleChoice: string;
let embed = new EmbedBuilder();
let embedMessage: Message;
let buttonReply: Message;
let row: ActionRowBuilder<ButtonBuilder>;

const enum VerificationStatus {
    Accepted = "Accepted ✅",
    Denied = "Denied ❌",
    Pending = "Pending 🕐",
}
@Discord()
@Category("Utilities")
// @Permission({ id: "755464917834006678", permission: false, type: "ROLE" })
// @Permission({ id: "463044315007156224", permission: true, type: "USER" })
// @Permission({ id: "428119121423761410", permission: true, type: "USER" })
export abstract class Verify {
    @Slash({
        description: "Verify yourself",
        descriptionLocalizations: {
            de: "Verifiziere, dass du tatsächlich du bist",
        },
        name: "verify",
    })
    @Guild("755432683579900035")
    async verify(
        @SlashOption({
            description: "Your first name",
            descriptionLocalizations: { de: "Dein Vorname" },
            name: "firstname",
            nameLocalizations: { de: "vorname" },
            type: ApplicationCommandOptionType.String,
        })
        firstName: string,
        @SlashOption({
            description: "Your surname",
            descriptionLocalizations: { de: "Dein Nachname" },
            name: "lastname",
            nameLocalizations: { de: "nachname" },
            type: ApplicationCommandOptionType.String,
        })
        surname: string,
        @SlashOption({
            description: "The current class you're in",
            descriptionLocalizations: { de: "Deine aktuelle Klasse/Stufe" },
            name: "class",
            nameLocalizations: { de: "klasse" },
            type: ApplicationCommandOptionType.String,
        })
        @SlashChoice(...classChoices)
        choice: string,
        @SlashOption({
            description: "Your optional nickname",
            descriptionLocalizations: { de: "Dein optionaler Spitzname" },
            name: "nickname",
            nameLocalizations: { de: "spitzname" },
            required: false,
            type: ApplicationCommandOptionType.String,
        })
        nickname: string,

        interaction: CommandInteraction
    ): Promise<InteractionResponse<boolean> | void> {
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
        if (
            !verificationChannel ||
            verificationChannel.type !== ChannelType.GuildText
        ) {
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

        embed = new EmbedBuilder()
            .setTimestamp()
            .setFooter({
                iconURL:
                    requestUser.user.avatarURL() ??
                    requestUser.user.defaultAvatarURL,
                text: `Request issued by ${requestUser.displayName}`,
            })
            .setColor("#B97425")
            .setThumbnail(
                requestUser.user.avatarURL() ??
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

        if (verificationChannel.type === ChannelType.GuildText) {
            embedMessage = await verificationChannel.send({ embeds: [embed] });
        } else {
            return interaction.reply({
                content:
                    "There was an error while sending the verification request.",
                ephemeral: true,
            });
        }

        const acceptButton = new ButtonBuilder()
            .setCustomId("accept")
            .setDisabled(false)
            .setEmoji("✅")
            .setLabel("Accept")
            .setStyle(ButtonStyle.Success);

        const denyButton = new ButtonBuilder()
            .setCustomId("deny")
            .setDisabled(false)
            .setEmoji("❌")
            .setLabel("Deny")
            .setStyle(ButtonStyle.Danger);

        row = new ActionRowBuilder<ButtonBuilder>().addComponents([
            acceptButton,
            denyButton,
        ]);
        buttonReply = await embedMessage.reply({
            components: [row],
            content:
                "Click one of the buttons below to accept or deny the request.",
        });
    }

    @ButtonComponent({ guilds: ["755432683579900035"], id: "accept" })
    accept(
        interaction: ButtonInteraction
    ): Promise<InteractionResponse<boolean>> {
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

    @ButtonComponent({ guilds: ["755432683579900035"], id: "deny" })
    deny(
        interaction: ButtonInteraction
    ): Promise<InteractionResponse<boolean>> {
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
