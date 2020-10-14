import {discordClient} from "./Client";
import {ICommand} from "./defintions/ICommand";
import {v4 as uuid} from "uuid";

class CommandHandler {
    public _instance = this;
    private cmdList: {[identifier: string]: ICommand} = {};

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

            for (const identifier in this.cmdList) {
                if (this.cmdList[identifier].cmds.indexOf(cmd) !== -1) {
                    this.cmdList[identifier].execute(msg, ...msgParts);
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
        this.cmdList[commandIdentifier] = cmd;
        return commandIdentifier;
    }

    /**
     * Removes an Command from Handler
     * @param identifier unique identifier of command provided as return from {@link registerCommand}
     */
    public deRegisterCommand(identifier: string) {
        delete this.cmdList[identifier];
    }
}

const commandHandlerInstance = new CommandHandler();
export = commandHandlerInstance