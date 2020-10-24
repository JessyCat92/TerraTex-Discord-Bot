import {discordClient} from "./Client";
import {ICommand} from "./defintions/ICommand";
import {v4 as uuid} from "uuid";
import {hasPermissionLevel} from "./Permission";

class CommandHandler {

    public _instance = this;
    private _cmdList: {[identifier: string]: ICommand} = {};

    constructor() {
        discordClient.on('message',
            msg => this.executeCommand(msg)
        );
    }

    private async executeCommand(msg) {
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

    /**
     * Registers Command
     * @param cmd Command Object from Interface {@link ICommand} or Instance of {@link Command}
     * @return unique Identifier of Command to manage command later in manager
     */
    public registerCommand(cmd: ICommand): string {
        const commandIdentifier = uuid();
        this._cmdList[commandIdentifier] = cmd;
        return commandIdentifier;
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
}

const commandHandlerInstance = new CommandHandler();
export = commandHandlerInstance