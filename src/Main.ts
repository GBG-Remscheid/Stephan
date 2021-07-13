import "reflect-metadata";
import * as dotenv from "dotenv"
import { Client } from "@typeit/discord";
import { Intents } from "discord.js";
import { NotBot } from "./Guards/NotBot";
import { Prefix } from "./Guards/Prefix";

dotenv.config()

export class Main {
    public static _client: Client;

    static get Client(): Client {
        return this._client;
    };

    static async start() {
        this._client = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_VOICE_STATES,
                Intents.FLAGS.GUILD_EMOJIS,
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
            /* slashGuilds: ["768975702187704360"], */
            classes: [
                `${__dirname}/Commands/**/*.ts`,
                `${__dirname}/Commands/**/*.js`,
                `${__dirname}/Events/**/*.ts`,
                `${__dirname}/Events/**/*.js`,
            ],
                /* guards: [NotBot, Prefix('hmm')] */
            });

            console.log(__dirname);



        await this._client.login(process.env.BOT_TOKEN);

        this._client.once("ready", async () => {
            await this._client.clearSlashes();
            await this._client.initSlashes();

            console.log(`Bot is now online. Logged in as ${this._client.user.username}.`);
        });

        this._client.on("interaction", async interaction => {

            await this._client.executeSlash(interaction);
        });

            this._client.on("debug", console.log);
    }
}

Main.start().catch(err => console.error(err)
);