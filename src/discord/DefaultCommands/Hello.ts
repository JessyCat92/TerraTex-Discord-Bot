import {registerCommand, registerSlashCommand} from "../CommandHandler";
import {Command} from "../defintions/Command";
import {CommandInteraction, Message} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {SlashCommand} from "../defintions/SlashCommand";

/*

registerCommand(new Command(0, ["hallo", "hey", "hi"], async (msgObj: Message) => {
        await sayHello(msgObj);
    })
        .setDescription("Sag mir Hallo!")
);

@FIXME: this script is not working completely
async function sayHello(msgObj: Message | CommandInteraction) {
    const morning = moment().startOf("day").add(6, "h");
    const lunch = moment().startOf("day").add(12, "h");
    const afternoon = moment().startOf("day").add(14, "h");
    const night = moment().startOf("day").add(18, "h");
    const latenight = moment().startOf("day").add(22, "h");

    if (moment().isBefore(morning)) {
        await msgObj.reply("Hey, solltest du nicht im Bett sein? Es ist doch mitten in der Nacht...");
    } else if (moment().isBefore(lunch)) {
        await msgObj.reply("Guten Morgen, ich hoffe du hast gut geschlafen :-)!");
    } else if (moment().isBefore(afternoon)) {
        await msgObj.reply("Hey! Lunchtime! Guten Hunger! ... oder viel Spaß beim Mittagsschlaf hihi :3");
    } else if (moment().isBefore(night)) {
        await msgObj.reply("Hallo :3 Darf es ein Stück Kuchen und Kaffee sein an diesem schönen Nachmittag?");
    } else if (moment().isBefore(latenight)) {
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

 */