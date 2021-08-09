import {registerCommand} from "../CommandHandler";
import {Command} from "../defintions/Command";
import {Message} from "discord.js";

registerCommand(new Command(0,["dice"], async (msgObj: Message, sidesArg: string, countArg: string) => {
    const sides = parseInt(sidesArg) || 6;
    const count = parseInt(countArg) || 1;

    const numbers = [];
    for(let i = 0; i < count; i++) {
        numbers.push(Math.floor(Math.random() * sides) + 1);
    }

    msgObj.reply(`Du hast folgende Zahlen mit deinen ${sides}-seitigen Würfel gewürfelt: ${numbers.join(", ")}`);

}).setDescription("Wirf einen Würfel!"));