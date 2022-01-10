import "reflect-metadata";
import { config } from 'dotenv';
import { Client } from "discordx";
import { Intents } from "discord.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { importx } from "@discordx/importer";
import io from "@pm2/io";

const __dirname = dirname(fileURLToPath(import.meta.url));

config({
    path: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env'
})
export class Main {
    private static _client: Client;

    static get Client(): Client {
        return this._client;
    };

    static async start() {
        this._client = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_VOICE_STATES,
                Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
                Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
                Intents.FLAGS.DIRECT_MESSAGES,
                Intents.FLAGS.DIRECT_MESSAGE_TYPING,
                Intents.FLAGS.GUILD_INTEGRATIONS,
                Intents.FLAGS.GUILD_PRESENCES,
                Intents.FLAGS.GUILD_WEBHOOKS,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_INVITES,
                Intents.FLAGS.GUILD_BANS,
            ],
            botGuilds: process.env.NODE_ENV === 'development' ? ["768975702187704360"] : [],
            presence: { activities: [{ name: 'the students 👁👁', type: "WATCHING" }] },
            failIfNotExists: true,
            silent: false
        });
        await importx(`${__dirname}/{Commands,Events}/**/*{.ts,.js}`);
        await this._client.login(process.env.BOT_TOKEN ?? "");


        this._client.once("ready", async () => {
            await this._client.clearApplicationCommands();
            await this._client.initApplicationCommands();
            await this._client.initApplicationPermissions();

            console.log(`Bot is now online. Logged in as ${this._client.user?.username}.`);
        });

        this._client.on("interactionCreate", async interaction => {
            this._client.executeInteraction(interaction);
        });

        this._client.on("debug", console.log);
    }
}

Main.start().catch(err => console.error(err)
);

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

io.init({
    tracing: true,
    profiling: true,
})