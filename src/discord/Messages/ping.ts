import ytdl from "ytdl-core";
import {discordClient} from "../Client";
import {createAudioPlayer, createAudioResource, getVoiceConnection} from "@discordjs/voice";
const { joinVoiceChannel } = require('@discordjs/voice');

const userTables: {[index: number]: UserPingEntry} = {};

interface UserPingEntry {
    lastTime: number;
    count: number;
}

const maxLength = 300;

discordClient.on('messageCreate', async msg => {
    if (msg.author.bot) return;

    const pings = msg.content.match(/ping/ig);
    if (pings && pings.length > 0) {

        // if no entry exist - create one
        if (!userTables[msg.author.id]) {
            userTables[msg.author.id] = {
                lastTime: 0,
                count: 0
            }
        }

        // reset Entry if older then 5 Min
        if (userTables[msg.author.id].lastTime < new Date().getTime() - 300000) {
            userTables[msg.author.id] = {
                lastTime: 0,
                count: 0
            }
        }

        const maxAllowedRest = maxLength - userTables[msg.author.id].count;

        if(maxAllowedRest <= 0) {
            await msg.reply("Du hattest genug Pongs für die nächsten 5 Minuten glaube ich :3 :P");
            return;
        }

        const cuttedPings = pings.slice(0, maxAllowedRest);

        let responses = [];

        for (const ping of cuttedPings) {
            let pongWord = "";
            pongWord += ping[0] === "p" ? "p" : "P";
            pongWord += ping[1] === "i" ? "o" : "O";
            pongWord += ping[2] === "n" ? "n" : "N";
            pongWord += ping[3] === "g" ? "g" : "G";

            responses.push(pongWord);
        }

        let response = responses.join(" ");

        if (cuttedPings.length !== pings.length) {
            await msg.reply(response);
            await msg.reply("Das waren genug Pongs glaube ich für die nächsten 5 Minuten glaube ich :3 :P");
        } else {
            await msg.reply(response);
        }

        userTables[msg.author.id] = {
            count: userTables[msg.author.id].count + cuttedPings.length,
            lastTime: new Date().getTime()
        }

    }
});