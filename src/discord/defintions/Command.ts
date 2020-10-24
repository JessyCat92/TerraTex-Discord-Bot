import {ICommand} from "./ICommand";
import {Message} from "discord.js";

export class Command implements ICommand {
    permLevel: number = 0;
    cmds: string[];
    func: Function;

    constructor(permLevel:number, cmds: string[], executeFunc: (msgObj: Message, ...params: string[]) => any) {
        this.cmds = cmds;
        this.func = executeFunc;
        this.permLevel = permLevel;
    }

    execute(msgObj: Message, ...params): void {
        this.func(msgObj, ...params);
    }
}
