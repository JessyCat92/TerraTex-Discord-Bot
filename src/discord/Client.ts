import {Client} from "discord.js";

export const discordClient = new Client();

export async function initDiscordClient() {
    discordClient.on('ready', () => {
        console.log(`Logged in as ${discordClient.user?.tag || "unknown"}!`);

        require("./DefaultCommands/index");
    });

    discordClient.on('message', async msg => {
        if (msg.content.indexOf("ping") !== -1) {
            let response = "";
            for (let i = 0;i < (msg.content.match(/ping/g) || ["ping"]).length; i++) {
                response += "pong ";
            }

            msg.reply(response);
        }
        if (msg.content === 'nya') {
            msg.reply('meow! ');
        }

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
    });

    try {
        await discordClient.login(process.env.DISCORD_BOT_TOKEN);
    } catch (e) {
        console.error(e);
    }
}