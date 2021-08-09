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
    discordClient.on('ready', () => {
        console.log(`Logged in as ${discordClient.user?.tag || "unknown"}!`);

        require("./DefaultCommands/index");
    });

    require("./Messages/index");

        // if (msg.content === 'join') {
        //     // Only try to join the sender's voice channel if they are in one themselves
        //     if (msg.member.voice.channel) {
        //         const connection = await msg.member.voice.channel.join();
        //         connection.play(ytdl('https://www.youtube.com/watch?v=ZlAU_w7-Xp8', {quality: 'highestaudio'}));
        //
        //     } else {
        //         msg.reply('You need to join a voice channel first!');
        //     }
        // }

    try {
        await discordClient.login(process.env.DISCORD_BOT_TOKEN);
    } catch (e) {
        console.error(e);
    }
}