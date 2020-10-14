import {registerCommand} from "../CommandHandler";
import {Command} from "../defintions/Command";
import {Message} from "discord.js";
import moment from "moment-feiertage";

registerCommand(new Command(["hallo", "hey", "hi"], async (msgObj: Message) => {
    const midnight = moment().startOf("day");

    const morning = moment().startOf("day").add(6, "h");
    const lunch = moment().startOf("day").add(12, "h");
    const afternoon = moment().startOf("day").add(14, "h");
    const night = moment().startOf("day").add(19, "h");

    if (moment().isBefore(morning)) {
        await msgObj.reply("Hey, solltest du nicht im Bett sein? Es ist doch mitten in der Nacht...");
    } else if (moment().isBefore(lunch)) {
        await msgObj.reply("Guten Morgen, ich hoffe du hast gut geschlafen :-)!");
    } else if (moment().isBefore(afternoon)) {
        await msgObj.reply("Hey! Lunchtime! Guten Hunger! ... oder viel Spaß beim Mittagsschlaf hihi :3");
    } else if (moment().isBefore(night)) {
        await msgObj.reply("Hallo :3 Darf es ein Stück Kuchen und Kaffee sein an diesem schönen Nachmittag?");
    } else {
        await msgObj.reply("***sing*** Guten Abend, Gute Nacht, bald wirst du ins Bett gebracht :3 ***sing***");
    }
}));