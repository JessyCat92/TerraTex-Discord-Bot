import {ICommand} from "./ICommand";
import {SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder} from "@discordjs/builders";
import {CommandInteraction} from "discord.js";


export class SlashCommand implements ICommand {
    cmds: string[];
    helpDescription: string;
    permLevel: number;
    command: Omit<SlashCommandBuilder|SlashCommandSubcommandsOnlyBuilder, "addSubcommand" | "addSubcommandGroup">;
    executeFunction: slashCommandExecute;

    constructor(cmd: SlashCommandBuilder|SlashCommandSubcommandsOnlyBuilder|Omit<SlashCommandBuilder|SlashCommandSubcommandsOnlyBuilder, "addSubcommand" | "addSubcommandGroup">,
                executeFunc: slashCommandExecute) {
        this.command = cmd;
        this.helpDescription = cmd.description;
        this.cmds = [cmd.name];
        this.executeFunction = executeFunc;

        // this will be checked by discord already for now, maybe add overwrite parameter?
        this.permLevel = 0;
    }

    execute(interaction: CommandInteraction): void {
        if(!interaction.isCommand()) return;

        this.executeFunction(interaction);
    }
}

export interface slashCommandExecute {
    (interaction: CommandInteraction): void;
}
