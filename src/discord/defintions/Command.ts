import {ICommand} from "./ICommand";
import {Message} from "discord.js";

export class Command implements ICommand {
    cmds: string[];
    func: Function;

    constructor(cmds: string[], executeFunc: (msgObj: Message, ...params: string[]) => any) {
        this.cmds = cmds;
        this.func = executeFunc;
    }

    execute(msgObj: Message, ...params): void {
        this.func(msgObj, ...params);
    }
}
