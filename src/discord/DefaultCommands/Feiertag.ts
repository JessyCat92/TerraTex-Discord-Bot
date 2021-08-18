import {registerSlashCommand} from "../CommandHandler";
import {CommandInteraction} from "discord.js";
import moment, {getAllStateCodes} from "moment-feiertage";
import {Moment} from "moment";
import {SlashCommandBuilder} from "@discordjs/builders";
import {SlashCommand} from "../defintions/SlashCommand";

const stateCodes = {
    ALL: "Alle",
    GER: "nur Bundesweite",
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
for (const code in stateCodes){
    stateCodeChoices.push([stateCodes[code], code]);
}

registerSlashCommand(
    new SlashCommand(
        new SlashCommandBuilder()
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
            ),
        async interaction => {
            await calcResponse(interaction);
        }
    )
);


async function calcResponse(msgObj : CommandInteraction) {
    console.log(getAllStateCodes());

    let filter: string|string[] = [];
    const selectedFilter = msgObj.options.getString("country");
    if (selectedFilter === "GER") {
        filter = [];
    } else if (selectedFilter === "ALL") {
        filter = [];
        for (const code in stateCodes){
            filter.push(code);
        }
    } else {
        filter = [selectedFilter];
    }

    const holiday = moment().isHoliday(selectedFilter) as IsHolidayResult;

    if ((holiday.holidayStates && holiday.holidayStates.length > 0) && !(!holiday.allStates && selectedFilter === "GER")) {
        await sendResponse(holiday, msgObj);
    } else if (msgObj.options.getBoolean("next")) {
        for (let i = 1; i <= 90; i++) {
            const momentData = moment().add(i, "d");
            const nextHoliday = momentData.isHoliday(filter) as IsHolidayResult;
            if ((nextHoliday.holidayStates && nextHoliday.holidayStates.length > 0) && !(!nextHoliday.allStates && selectedFilter === "GER")) {
                return await sendResponse(nextHoliday, msgObj, momentData);
            }
        }

        return msgObj.reply("Es gibt keine Feiertage in den nächsten 90 Tagen...")
    } else {
        await msgObj.reply("Heute ist kein Feiertag!");
    }
}

async function sendResponse(holiday: IsHolidayResult, msgObj: CommandInteraction, momentData: Moment = null) {
    let dateString = "Heute";
    if (momentData !== null) {
        dateString = `Am ${momentData.date()}.${momentData.month() + 1}.${momentData.year()}`;
    }


    if (holiday.allStates) {
        await msgObj.reply(`${dateString} ist ein Bundesweiter Feiertag: ${holiday.holidayName}!`);
    } else {
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