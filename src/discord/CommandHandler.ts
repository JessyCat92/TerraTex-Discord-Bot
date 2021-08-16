import {discordClient} from "./Client";
import {ICommand} from "./defintions/ICommand";
import {v4 as uuid} from "uuid";
import {hasPermissionLevel} from "./Permission";
import {SlashCommand} from "./defintions/SlashCommand";
import {CommandInteraction} from "discord.js";

class CommandHandler {

    public _instance = this;
    private _cmdList: {[identifier: string]: ICommand} = {};
    private _slashCmdList: {[cmdName: string]: SlashCommand} = {};

    constructor() {
        discordClient.on('messageCreate',
            msg => this.executeCommand(msg)
        );

        discordClient.on('interactionCreate', interaction => this.executeSlashCommand(interaction));
    }

    private async executeCommand(msg) {
        if (msg.channel.type === "dm") return;

        if (msg.content.startsWith("!")) {
            const msgParts = msg.content.split(" ");
            const cmd = msgParts[0].slice(1).toLowerCase();
            msgParts.shift();

            for (const identifier in this._cmdList) {
                if (this._cmdList[identifier].cmds.indexOf(cmd) !== -1) {
                    if (await hasPermissionLevel(msg, this._cmdList[identifier].permLevel)) {
                        this._cmdList[identifier].execute(msg, ...msgParts);
                    } else {
                        msg.reply("Du hast nicht die Berechtigung diesen Befehl zu nutzen!");
                    }
                }
            }
        }
    }

    private async executeSlashCommand(interaction: CommandInteraction) {
        if(!interaction.isCommand()) return;

        // @ts-ignore
        this._slashCmdList[interaction.commandName].execute(interaction);
    }

    /**
     * Registers Command
     * @param cmd Command Object from Interface {@link ICommand} or Instance of {@link Command}
     * @return string unique Identifier of Command to manage command later in manager
     */
    public registerCommand(cmd: ICommand): string {
        const commandIdentifier = uuid();
        this._cmdList[commandIdentifier] = cmd;
        return commandIdentifier;
    }

    /**
     * Registers Slash Command Executer
     * @param cmd Command Object from Interface {@link ICommand} or Instance of {@link SlashCommand}
     * @return void
     */
    public registerSlashCommand(cmd: SlashCommand) {
        this._slashCmdList[cmd.cmds[0]] = cmd;
        [...discordClient.guilds.cache.values()][0].commands.create(cmd.command.toJSON());

    }

    /**
     * Removes an Command from Handler
     * @param identifier unique identifier of command provided as return from {@link registerCommand}
     */
    public deRegisterCommand(identifier: string) {
        delete this._cmdList[identifier];
    }

    get cmdList(): { [p: string]: ICommand } {
        return this._cmdList;
    }

    get slashCmdList(): { [cmd: string]: SlashCommand } {
        return this._slashCmdList;
    }
}

const commandHandlerInstance = new CommandHandler();
export = commandHandlerInstance