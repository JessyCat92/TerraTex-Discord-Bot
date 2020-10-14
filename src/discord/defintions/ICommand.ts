import {Message} from "discord.js";

export interface ICommand {
    cmds: string[];
    execute(msgObj: Message, ...params: string[]): void;
}