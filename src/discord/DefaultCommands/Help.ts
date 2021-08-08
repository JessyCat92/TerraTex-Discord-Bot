import {registerCommand, cmdList} from "../CommandHandler"
import {Message, MessageEmbed} from "discord.js";
import {Command} from "../defintions/Command";
import {hasPermissionLevel} from "../Permission";

registerCommand(new Command(0, ["help", "hilfe"], async (msg: Message, all: string) => {
        const cmdsSorted: { [permLevel: number]: any } = {
            0: [], 1: [], 2: [], 3: [], 4: []
        };

        const titles = {
            0: "General",
            1: "Only VIP",
            2: "Only Moderators",
            3: "Only Administrators",
            4: "Only Owners"
        }

        const colors = {
            0: "GREY",
            1: "#f805d7",
            2: "#fd9d24",
            3: "#ff0101",
            4: "#c20003"
        }

        for (const indentifier in cmdList) {
            cmdsSorted[cmdList[indentifier].permLevel].push({
                name: cmdList[indentifier].cmds.join(", "),
                value: cmdList[indentifier].helpDescription
            });
        }

        for (const levelAsStr in cmdsSorted) {
            const level = parseInt(levelAsStr, 10);
            if (cmdsSorted[level].length === 0) continue;
            // @ts-ignore
            if (!await hasPermissionLevel(msg, level)) continue;

            let cmds = "";
            let desc = "";

            for (const cmdObj of cmdsSorted[level]) {
                cmds += `${cmdObj.name}\n`;
                desc += `${cmdObj.value}\n`;
            }

            const msgEmb = new MessageEmbed();
            msgEmb.setTitle(titles[level]);
            msgEmb.setColor(colors[level]);
            msgEmb.addField("Cmds", cmds, true);
            msgEmb.addField("Description", desc, true);

            await msg.author.send(msgEmb);
        }
        await msg.reply("Ich habe dir eine DM mit allen verfügbaren Befehlen gesendet :3 UwU")
    })
    .setDescription("Zeigt aktuelle Hilfe an")
);
