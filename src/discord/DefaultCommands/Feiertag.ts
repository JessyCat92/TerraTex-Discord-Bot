import {registerCommand} from "../CommandHandler";
import {Command} from "../defintions/Command";
import {Message} from "discord.js";
import moment from "moment-feiertage";

registerCommand(new Command(["feiertag", "holiday"], async (msgObj: Message) => {
    const holiday = moment().isHoliday([]) as IsHolidayResult;

    if (holiday.holidayStates.length > 0) {
        if (holiday.allStates) {
            await msgObj.reply(`Heute ist ein Bundesweiter Feiertag: ${holiday.holidayName}!`);
        } else {
            const stateCodes = {
                BW: "Baden-Württemberg",
                BY: "Bayern",
                BE: "Berlin",
                BB: "Brandenburg",
                HB: "Bremen",
                HH: "Hamburg",
                HE: "Hessen",
                MV: "Mecklenburg-Vorpommern",
                NI: "Niedersachsen",
                NW: "Nordrhein-Westfalen",
                RP: "Rheinland-Pfalz",
                SL: "Saarland",
                SN: "Sachsen",
                ST: "Sachsen-Anhalt",
                SH: "Schleswig-Holstein",
                TH: "Thüringen",
            }

            const fullList = [];
            for (const state of holiday.holidayStates) {
                fullList.push(stateCodes[state]);
            }

            await msgObj.reply(`Heute ist ${holiday.holidayName} in ${fullList.join(",")}!`);
        }
    } else {
        await msgObj.reply("Heute ist kein Feiertag!");
    }
}));

interface IsHolidayResult {
    allStates: boolean;
    holidayName: string;
    holidayStates: Array<string>;
    testedStates: Array<string>;
}