import {Message} from "discord.js";

export interface ICommand {
    /**
     * Permission Level:
     * 0 - everyone can use it
     * 1 - only VIP or higher
     * 2 - only Moderator or higher
     * 3 - Administrators or higher
     * 4 - System Owners or higher (@todo: group setup or custom user ID List?)
     */
    permLevel: number;
    helpDescription: string;
    cmds: string[];
    slash: boolean;
    execute(msgObj: Message, ...params: string[]): void;
}
