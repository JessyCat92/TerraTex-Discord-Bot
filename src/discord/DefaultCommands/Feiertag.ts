import {registerSlashCommand} from "../CommandHandler";
import {CommandInteraction} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {SlashCommand} from "../defintions/SlashCommand";
import Holidays, {HolidaysTypes} from "date-holidays"
import {calcDate, getDateString} from "../../utils/DateTime";

const stateCodes = {
    PUBLIC: "nur Bundesweite",
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

const stateCodeChoices = [];
stateCodeChoices.push(["Alle", "ALL"]);
for (const code in stateCodes) {
    stateCodeChoices.push([stateCodes[code], code]);
}

const stateObjects = {};

registerSlashCommand(
    new SlashCommand(new SlashCommandBuilder()
        .setDescription("Ist Feiertag / Welcher ist der nächste?")
        .setName("holiday")
        .addBooleanOption(option =>
            option
                .setName("next")
                .setDescription("Nächster?")
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("country")
                .setDescription("Bundesland")
                .setRequired(false)
                .addChoices(
                    stateCodeChoices
                )
        )
        .addBooleanOption(
            option =>
                option
                    .setName("optional")
                    .setDescription("Inklusive optionaller Brückentage?")
                    .setRequired(false)
        ), async interaction => {
        await calcResponse(interaction);
    })
);

async function calcResponse(msgObj: CommandInteraction) {
    const country = msgObj.options.getString("country") || "PUBLIC";
    const isNext = msgObj.options.getBoolean("next") || false;
    const inclOptionals = msgObj.options.getBoolean("optional") || false;

    // create Holiday Objects per State
    for (const code in stateCodes) {
        stateObjects[code] = {
            holidayObj: new Holidays({
                country: "DE",
                state: code !== "PUBLIC" ? code : null
            }, {
                languages: "de",
                types: inclOptionals ? [
                    "public",
                    "optional",
                    "bank",
                ] : [
                    "public"
                ]
            })
        }
    }

    // calculate all holidays of next 90 days
    const holidaysPerDay: { [name: string]: HolidayData }[] = [];
    for (let i = 0; i <= 90; i++) {
        let foundHolidays = {};

        for (const code in stateCodes) {
            const nextHoliday = stateObjects[code].holidayObj.isHoliday(calcDate(new Date(), {
                timeString: `${i}d`
            }));

            if (nextHoliday && nextHoliday.length > 0) {
                if (!foundHolidays[nextHoliday[0].name]) {
                    foundHolidays[nextHoliday[0].name] = {
                        data: nextHoliday[0],
                        countries: []
                    }
                }
                foundHolidays[nextHoliday[0].name].countries.push(code);
            }
        }

        holidaysPerDay.push(foundHolidays);
    }

    if (!isNext) {
        if (!await hasDayHolidayAndSendResponse(msgObj, holidaysPerDay[0], country)) {
            return await msgObj.reply("Heute ist kein Feiertag!");
        }
        return;
    }

    for (const day of holidaysPerDay) {
        if (await hasDayHolidayAndSendResponse(msgObj, day, country)) {
            return;
        }
    }

    return await msgObj.reply("Ich konnte keinen Feiertag in den nächsten 90 Tagen finden!");
}

async function hasDayHolidayAndSendResponse(msgObj, day, country): Promise<boolean> {
    if (Object.keys(day).length > 0) {
        let holidaysDataArray: HolidayData[] = [];

        holidaysDataArray = Object.values(day);

        //send here data for today
        if (country !== "ALL") {
            holidaysDataArray = filterDataByCountry(day, country);
        }

        if (holidaysDataArray.length === 0) return false;

        await sendResponse(msgObj, holidaysDataArray);
        return true;
    }
    return false;
}

function filterDataByCountry(holidays: { [name: string]: HolidayData }, country): HolidayData[] {
    const result: HolidayData[] = [];
    for (const name in holidays) {
        const data: HolidayData = holidays[name];

        if (data.countries.indexOf(country) > -1) {
            result.push(data);
        }
    }
    return result;
}

interface HolidayData {
    data: HolidaysTypes.Holiday,
    countries: string[]
}

async function sendResponse(msgObj: CommandInteraction, holidayData: HolidayData[]) {
    const date = getDateString(new Date(holidayData[0].data.date));

    let msg = "";
    for (const holiday of holidayData) {
        if (msg.length > 0) msg+= `
        
`;

        if (holiday.countries.indexOf("PUBLIC") === -1) {
            msg += `${date} ist \`${holiday.data.name}\` in ${countryArrayToNamesString(holiday.countries)}`;
        } else {
            msg += `${date} ist \`${holiday.data.name}\`, ein bundesweiter Feiertag`;
        }

    }

    await msgObj.reply(msg);
}

function countryArrayToNamesString(countries: string[]) {
    const countryNames = [];
    for (const short of countries) {
        if (short === "PUBLIC") {
            continue;
        }

        countryNames.push(stateCodes[short]);
    }

    return countryNames.join(", ").replace(/(.*)(, )(.*)/, "$1 und $3");
}