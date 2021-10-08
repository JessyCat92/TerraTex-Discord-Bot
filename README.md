# TerraTex-Discord-Bot

    docker run --name discord_bot -p 3306:3306 -eMYSQL_DATABASE=discord_bot -e MYSQL_ROOT_PASSWORD=Asdf123! -d mariadb:10.6.3


Code for later sound functions:
```
if (msg.content === 'hdl') {
    // Only try to join the sender's voice channel if they are in one themselves
    if (msg.member.voice.channel) {
        const connection = joinVoiceChannel({
            channelId: msg.member.voice.channelId,
            guildId: msg.member.voice.guild.id,
            adapterCreator: msg.member.voice.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        connection.subscribe(player);

        const resource = createAudioResource(ytdl('https://www.youtube.com/watch?v=O84_yUxaUUY', {quality: 'highestaudio'}));
        player.play(resource);


    } else {
        msg.reply('You need to join a voice channel first!');
    }
}
```