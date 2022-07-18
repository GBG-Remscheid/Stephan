import "reflect-metadata";
import { Client, DIService } from "discordx";
import { container, singleton } from "tsyringe";
import { ActivityType, GatewayIntentBits } from "discord.js";
import { NotBot } from "@discordx/utilities";
import { config } from "dotenv";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { importx } from "@discordx/importer";
import io from "@pm2/io";

const __dirname = dirname(fileURLToPath(import.meta.url));

config({
    path: process.env.NODE_ENV === "development" ? ".env" : ".env.production",
});

DIService.container = container;
@singleton()
export class Main {
    private static _client: Client;

    static get Client(): Client {
        return this._client;
    }

    static async start(): Promise<void> {
        this._client = new Client({
            botGuilds:
                process.env.NODE_ENV === "development"
                    ? ["768975702187704360"]
                    : [],
            failIfNotExists: true,
            guards: [NotBot],
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageTyping,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildBans,
            ],
            presence: {
                activities: [
                    { name: "the students 👁👁", type: ActivityType.Watching },
                    { name: "deine Mum an", type: ActivityType.Watching },
                ],
            },
            silent: false,
        });
        await importx(`${__dirname}/{Commands,Events}/**/*{.ts,.js}`);
        if (!process.env.BOT_TOKEN) {
            throw new Error(
                "Could not find BOT_TOKEN in your environment variables! Did you add it to your .env file?"
            );
        }
        await this._client.login(process.env.BOT_TOKEN);

        this._client.once("ready", async () => {
            await this._client.clearApplicationCommands();
            await this._client.initApplicationCommands();
            // await this._client.initApplicationPermissions(true);

            console.log(
                `Bot is now online. Logged in as ${this._client.user?.username}.`
            );
        });

        this._client.on("interactionCreate", interaction => {
            this._client.executeInteraction(interaction);
        });

        this._client.on("debug", console.log);
    }
}

Main.start().catch(err => console.error(err));

io.init({
    metrics: {
        http: true,
    },
    profiling: true,
    tracing: true,
});
