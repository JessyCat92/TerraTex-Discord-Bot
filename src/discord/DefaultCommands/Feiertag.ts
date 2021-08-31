import {registerSlashCommand} from "../CommandHandler";
import {CommandInteraction} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {SlashCommand} from "../defintions/SlashCommand";
import Holidays, {HolidaysTypes} from "date-holidays"
import {calcDate} from "../../utils/DateTime";

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
stateCodeChoices.push(["ALL", "Alle"]);
for (const code in stateCodes) {
    stateCodeChoices.push([stateCodes[code], code]);
}

const stateObjects = {};

registerSlashCommand(
    new SlashCommand(
        new SlashCommandBuilder()
            .setDescription("Ist Feiertag / Welcher ist der nächste?")
            .setName("tholiday")
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
            ),
        async interaction => {
            await calcResponse(interaction);
        }
    )
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
    const holidaysPerDay = [];
    for (let i = 0; i <= 90; i++) {
        let foundHolidays = {};

        for (const code in stateCodes) {
            const nextHoliday =  stateObjects[code].holidayObj.isHoliday(calcDate(new Date(), {
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
        if (Object.keys(holidaysPerDay[0]).length > 0){
            //send here data for today
        } else {
            return await msgObj.reply("Heute ist kein Feiertag!");
        }
    }

    // send data for future day
    // @todo: send message per holiday and tell which states
    // @todo: filter message by state
}

/*

    const holidays = new Holidays({
        country: "DE",
        state: country !== "PUBLIC" ? country : null
    }, {
        languages: "de",
         types: inclOptionals ? [
            "public",
            "optional",
            "bank",
        ] : [
            "public"
        ]
    });

 const today = holidays.isHoliday(new Date());

 if (!today) {
        if (isNext) {
            for (let i = 1; i <= 90; i++) {
                const nextHoliday = holidays.isHoliday(calcDate(new Date(), {
                    timeString: `${i}d`
                }));

                if (nextHoliday && nextHoliday.length > 0) {
                    return await sendResonse(msgObj, nextHoliday[0]);
                }
            }

            await msgObj.reply("Heute und in den nächsten 90 Tagen ist kein Feiertag!");
        } else {

        }
    }
 */

async function sendResonse(msgObj: CommandInteraction, holiday: HolidaysTypes.Holiday) {
    const date = new Intl.DateTimeFormat("de", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        // @ts-ignore
    }).format(new Date(holiday.date));

    await msgObj.reply(
        `Am ${date} ist ${holiday.name}.`
    );
}