import {Client, Intents} from "discord.js";

export let discordClient;

export async function createClient () {
    discordClient = new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_BANS,
            Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
            Intents.FLAGS.GUILD_INTEGRATIONS,
            Intents.FLAGS.GUILD_WEBHOOKS,
            Intents.FLAGS.GUILD_INVITES,
            Intents.FLAGS.GUILD_VOICE_STATES,
            Intents.FLAGS.GUILD_PRESENCES,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.GUILD_MESSAGE_TYPING,
            Intents.FLAGS.DIRECT_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
            Intents.FLAGS.DIRECT_MESSAGE_TYPING
        ],
        failIfNotExists: true
    });
    return discordClient;
}

export async function initDiscordClient() {
    discordClient.on('ready', async () => {
        console.log(`Logged in as ${discordClient.user?.tag || "unknown"}!`);

        require("./DefaultCommands/index");

        const cmds = await [...discordClient.guilds.cache.values()][0].commands.fetch();

        const cmdHandler = require("./CommandHandler");
        const registeredCmds = Object.keys(cmdHandler.slashCmdList);

        for ( const cmd of cmds) {
            if (registeredCmds.indexOf(cmd[1].name) === -1 )
                cmd[1].delete();
        }
    });

    require("./Messages/index");



    try {
        await discordClient.login(process.env.DISCORD_BOT_TOKEN);
    } catch (e) {
        console.error(e);
    }
}