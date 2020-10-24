import {registerCommand} from "../CommandHandler";
import {Command} from "../defintions/Command";
import {Message} from "discord.js";
import moment from "moment-feiertage";
import {Moment} from "moment";

registerCommand(new Command(["feiertag", "holiday"], async (msgObj: Message, next) => {
    const holiday = moment().isHoliday([]) as IsHolidayResult;

    if (holiday.holidayStates.length > 0) {
        await sendResponse(holiday, msgObj);
    } else if (next.toLowerCase() === "next") {
        for (let i = 1; i <= 90; i++) {
            const momentData = moment().add(i, "d");
            const nextHoliday = momentData.isHoliday([]) as IsHolidayResult;
            if (nextHoliday.holidayStates.length > 0) {
                return await sendResponse(nextHoliday, msgObj, momentData);
            }
        }

        return msgObj.reply("Es gibt keine Feiertage in den nächsten 90 Tagen...")
    } else {
        await msgObj.reply("Heute ist kein Feiertag!");
    }
}));


async function sendResponse(holiday: IsHolidayResult, msgObj: Message, momentData: Moment = null) {
    let dateString = "Heute";
    if (momentData !== null) {
        dateString = `Am ${momentData.date()}.${momentData.month() + 1}.${momentData.year()}`;
    }


    if (holiday.allStates) {
        await msgObj.reply(`${dateString} ist ein Bundesweiter Feiertag: ${holiday.holidayName}!`);
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
        for (const index in holiday.holidayStates) {
            fullList.push(stateCodes[holiday.holidayStates[index]]);
        }
        let countryList =
            fullList.length === 1 ?
                fullList[0] :
                `${fullList.slice(0, -1).join(", ")} und ${fullList[fullList.length - 1]}`;
        
        await msgObj.reply(`${dateString} ist ${holiday.holidayName} in ${countryList}!`);
    }
}

interface IsHolidayResult {
    allStates: boolean;
    holidayName: string;
    holidayStates: Array<string>;
    testedStates: Array<string>;
}