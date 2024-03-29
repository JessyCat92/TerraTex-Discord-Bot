import {createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior} from "@discordjs/voice";

import {registerCommand, registerSlashCommand} from "../CommandHandler";
import {CommandInteraction} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {SlashCommand} from "../defintions/SlashCommand";

registerSlashCommand(
    new SlashCommand(new SlashCommandBuilder()
        .setName("connect_live_stream")
        .setDescription("Connect to Jessys Live Stream"),
        // .addIntegerOption(
        //     option => option
        //         .setName("strea")
        //         .setDescription("Wie viele Seiten hat dein Würfel?")
        //         .setRequired(false)
        // ),
        calcResponse
    )
);

async function calcResponse(msgObj: CommandInteraction) {
    if (!msgObj.isCommand()) return;
    // const options = msgObj.options as CommandInteractionOptionResolver;

    // console.log(msgObj.channel);

    msgObj.reply("ok")

    const connection = joinVoiceChannel({
        channelId: msgObj.channel.id,
        guildId: msgObj.channel.guild.id,
        adapterCreator: msgObj.channel.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Play,
        },
    });

    const resource = createAudioResource("rtsp://root.terratex.eu:8554/alex_and_me", {
        silencePaddingFrames: 1,
        inlineVolume: false
    });
    player.play(resource);

// Play "track.mp3" across two voice connections
    connection.subscribe(player);
}