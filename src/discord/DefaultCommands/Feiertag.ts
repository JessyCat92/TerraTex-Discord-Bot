import {registerSlashCommand} from "../CommandHandler";
import {CommandInteraction} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {SlashCommand} from "../defintions/SlashCommand";
import Holidays, {HolidaysTypes} from "date-holidays"
import {calcDate} from "../../utils/DateTime";

const stateCodes = {
//    ALL: "Alle",
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
for (const code in stateCodes) {
    stateCodeChoices.push([stateCodes[code], code]);
}

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
            await msgObj.reply("Heute ist kein Feiertag!");
        }
    }
}

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
