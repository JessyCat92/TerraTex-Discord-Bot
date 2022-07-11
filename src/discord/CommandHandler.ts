import {discordClient} from "./Client";
import {ICommand} from "./defintions/ICommand";
import {v4 as uuid} from "uuid";
import {hasPermissionLevel} from "./Permission";
import {SlashCommand} from "./defintions/SlashCommand";
import {CommandInteraction} from "discord.js";

class CommandHandler {

    public _instance = this;
    static _cmdList: {[identifier: string]: ICommand} = {};
    static _slashCmdList: {[cmdName: string]: SlashCommand} = {};

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

            for (const identifier in CommandHandler._cmdList) {
                if (CommandHandler._cmdList[identifier].cmds.indexOf(cmd) !== -1) {
                    if (await hasPermissionLevel(msg, CommandHandler._cmdList[identifier].permLevel)) {
                        CommandHandler._cmdList[identifier].execute(msg, ...msgParts);
                    } else {
                        msg.reply("Du hast nicht die Berechtigung diesen Befehl zu nutzen!");
                    }
                }
            }
        }
    }

    private async executeSlashCommand(interaction: CommandInteraction) {
        if(!interaction.isCommand()) return;

        // @todo: add permission check here

        // @ts-ignore
        CommandHandler._slashCmdList[interaction.commandName].execute(interaction);
    }

    /**
     * Registers Command
     * @param cmd Command Object from Interface {@link ICommand} or Instance of {@link Command}
     * @return string unique Identifier of Command to manage command later in manager
     */
    public registerCommand(cmd: ICommand): string {
        const commandIdentifier = uuid();
        CommandHandler._cmdList[commandIdentifier] = cmd;
        return commandIdentifier;
    }

    /**
     * Registers Slash Command Executer
     * @param cmd Command Object from Interface {@link ICommand} or Instance of {@link SlashCommand}
     * @return void
     */
    public registerSlashCommand(cmd: SlashCommand) {
        CommandHandler._slashCmdList[cmd.cmds[0]] = cmd;
        [...discordClient.guilds.cache.values()][0].commands.create(cmd.command.toJSON());

    }

    get cmdList(): { [p: string]: ICommand } {
        return CommandHandler._cmdList;
    }

    get slashCmdList(): { [cmd: string]: SlashCommand } {
        return CommandHandler._slashCmdList;
    }
}

const commandHandlerInstance = new CommandHandler();
export = commandHandlerInstance;