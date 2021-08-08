import {discordClient} from "../Client";

discordClient.on('message', async msg => {
    if (msg.author.bot) return;

    const pings = msg.content.match(/ping/ig);
    if (pings && pings.length > 0) {
        let responses = [];

        const pings = msg.content.match(/ping/ig);

        for (const ping of pings) {
            let pongWord = "";
            pongWord += ping[0] === "p" ? "p" : "P";
            pongWord += ping[1] === "i" ? "o" : "O";
            pongWord += ping[2] === "n" ? "n" : "N";
            pongWord += ping[3] === "g" ? "g" : "G";

            responses.push(pongWord);
        }

        let response = responses.join(" ");

        if (response.length >= 2000) {
            response = response.substr(0, (2000 - 20 - msg.author.username.length));
            await msg.reply(response);
            await msg.reply("Das waren genug Pongs glaube ich :3 :P");
        } else {
            await msg.reply(response);
        }

    }
});