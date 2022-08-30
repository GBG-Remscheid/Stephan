import {
    ApplicationCommandOptionType,
    Colors,
    CommandInteraction,
    EmbedBuilder,
} from "discord.js";
import {
    Discord,
    Guild,
    Slash,
    SlashChoice,
    SlashGroup,
    SlashOption,
} from "discordx";
import exaroton from "exaroton";
import { container, injectable } from "tsyringe";

import { Env } from "../../../Utils/Env.js";

const { Client } = exaroton;
const Servers = [{ name: "MundM", value: "qVJ4kEeIQv50pHiN" }];

@Discord()
@injectable()
@Guild("960947577589756015")
@SlashGroup({
    description: "commands to manage your server(s) on exaroton",
    name: "exaroton",
})
export class Exaroton {
    constructor(private env: Env) {}
    exarotonToken = container.resolve(Env).exaroton;
    client = new Client(this.exarotonToken);

    @Slash({ name: "start" })
    @SlashGroup("exaroton")
    async start(
        @SlashOption({
            required: true,
            name: "server-name",
            type: ApplicationCommandOptionType.String,
        })
        @SlashChoice(...Servers)
        serverId: string,

        interaction: CommandInteraction
    ): Promise<void> {
        const servers = await this.client.getServers();
        const startServer = servers.find(server => server.id === serverId);

        if (!startServer) {
            interaction.reply({
                content: "This server does not exist",
                ephemeral: true,
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(startServer.name)
            .setDescription("Starting your server...")
            .setColor(Colors.Yellow);

        const emdebEdit = embed
            .setColor(Colors.Green)
            .setDescription("Your server has been started successfully.");

        if (
            startServer.hasStatus(startServer.STATUS.ONLINE) ||
            startServer.status === startServer.STATUS.STARTING
        ) {
            interaction.reply({
                content: "This server is already started",
                ephemeral: true,
            });
            return;
        }

        await interaction.reply({ embeds: [embed] });
        await startServer.start();
        interaction.editReply({ embeds: [emdebEdit] });
    }

    @Slash({ name: "stop" })
    @SlashGroup("exaroton")
    async stop(
        @SlashOption({
            required: true,
            name: "server-name",
            type: ApplicationCommandOptionType.String,
        })
        @SlashChoice(...Servers)
        serverId: string,

        interaction: CommandInteraction
    ): Promise<void> {
        const servers = await this.client.getServers();
        const stopServer = servers.find(server => server.id === serverId);

        if (!stopServer) {
            interaction.reply({
                content: "This server does not exist",
                ephemeral: true,
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(stopServer.name)
            .setDescription("Stopping your server...")
            .setColor(Colors.Yellow);

        const emdebEdit = embed
            .setColor(Colors.Red)
            .setDescription("Your server has been stopped successfully.");

        if (
            stopServer.status === stopServer.STATUS.STOPPING ||
            stopServer.status === stopServer.STATUS.OFFLINE
        ) {
            interaction.reply({
                content: "This server is already stopped",
                ephemeral: true,
            });
            return;
        }

        await interaction.reply({ embeds: [embed] });
        await stopServer.stop();
        interaction.editReply({ embeds: [emdebEdit] });
    }

    @Slash({ name: "status" })
    @SlashGroup("exaroton")
    async status(
        @SlashOption({
            required: true,
            name: "server-name",
            type: ApplicationCommandOptionType.String,
        })
        @SlashChoice(...Servers)
        serverId: string,

        interaction: CommandInteraction
    ): Promise<void> {
        const servers = await this.client.getServers();
        const statusServer = servers.find(server => server.id === serverId);

        if (!statusServer) {
            interaction.reply({
                content: "This server does not exist",
                ephemeral: true,
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(statusServer.name)
            .setDescription("Server stats:")
            .addFields([
                {
                    inline: true,
                    name: "Status",
                    value: statusServer.status.toString(),
                },
                {
                    inline: true,
                    name: "Players",
                    value: `${statusServer.players.count}/${statusServer.players.max}`,
                },
                {
                    inline: true,
                    name: "Software",
                    value: statusServer.software.toString(),
                },
                {
                    inline: true,
                    name: "Version",
                    value: statusServer.software.version,
                },
            ])
            .setColor(
                statusServer.status === statusServer.STATUS.ONLINE
                    ? Colors.Green
                    : Colors.Red
            );

        interaction.reply({ embeds: [embed] });
    }
}
