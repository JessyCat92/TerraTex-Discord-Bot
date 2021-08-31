import {registerCommand, registerSlashCommand} from "../CommandHandler";
import {Command} from "../defintions/Command";
import {CommandInteraction, Message} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {SlashCommand} from "../defintions/SlashCommand";


registerCommand(new Command(0, ["hallo", "hey", "hi"], async (msgObj: Message) => {
        await sayHello(msgObj);
    })
        .setDescription("Sag mir Hallo!")
);

async function sayHello(msgObj: Message | CommandInteraction) {
    if (new Date().getHours() < 6) {
        await msgObj.reply("Hey, solltest du nicht im Bett sein? Es ist doch mitten in der Nacht...");
    } else if (new Date().getHours() < 12) {
        await msgObj.reply("Guten Morgen, ich hoffe du hast gut geschlafen :-)!");
    } else if (new Date().getHours() < 14) {
        await msgObj.reply("Hey! Lunchtime! Guten Hunger! ... oder viel Spaß beim Mittagsschlaf hihi :3");
    } else if (new Date().getHours() < 18) {
        await msgObj.reply("Hallo :3 Darf es ein Stück Kuchen und Kaffee sein an diesem schönen Nachmittag?");
    } else if (new Date().getHours() < 23) {
        await msgObj.reply("Guten Abend :3 Lust auf eine Runde zocken?");
    } else {
        await msgObj.reply("***sing*** Guten Abend, Gute Nacht, bald wirst du ins Bett gebracht :3 ***sing***");
    }
}

registerSlashCommand(
    new SlashCommand(
        new SlashCommandBuilder()
            .setName("hallo")
            .setDescription("Maid begrüße mich!"),
        interaction => sayHello(interaction))
);
