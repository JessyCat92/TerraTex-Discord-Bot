import {ICommand} from "./ICommand";
import {CommandInteraction, Message} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

export class Command implements ICommand {
    permLevel: number = 0;
    helpDescription: string = "No Description available";
    cmds: string[];
    func: commandExecute;

    constructor(permLevel:number, cmds: string[], executeFunc: commandExecute) {
        this.cmds = cmds;
        this.func = executeFunc;
        this.permLevel = permLevel;
    }

    execute(msgObj: Message, ...params): void {
        this.func(msgObj, ...params);
    }

    setDescription(helpDescription): this {
        this.helpDescription = helpDescription
        return this;
    }

}

export interface commandExecute {
    (msgObj: Message, ...params: String[]): void;
}

