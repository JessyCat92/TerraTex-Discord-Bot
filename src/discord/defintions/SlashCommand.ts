import {ICommand} from "./ICommand";
import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction, Message} from "discord.js";
import {discordClient} from "../Client";


export class SlashCommand implements ICommand {
    cmds: string[];
    helpDescription: string;
    permLevel: number;
    command: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    executeFunction: slashCommandExecute;

    constructor(cmd: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">, executeFunc: slashCommandExecute) {
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