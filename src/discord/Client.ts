import {Client, GatewayIntentBits} from "discord.js";

export let discordClient: Client;

export async function createClient () {
    discordClient = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildBans,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildWebhooks,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.DirectMessageTyping
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