import {registerCommand} from "../../CommandHandler";
import {Command} from "../../defintions/Command";
import {Message, MessageEmbed} from "discord.js";
import {Permissions} from "../../../db/entities/Permissions";
import {In} from "typeorm";

registerCommand(new Command(4, ["perm"], (msgObj, subCommand,...perams) => {
    switch (subCommand) {
        case "add": return addPermission(msgObj, ...perams);
        case "remove": return removePermission(msgObj);
        case "list": return listPermission(msgObj);
        case "help":
        default: return helpPermission(msgObj);
    }
}).setDescription("Befehl zum Managen der Permissions"));

async function addPermission(msgObj: Message, ...params) {
    const permLevelObj = new Number(params[0]);
    if(permLevelObj && msgObj.mentions.roles.size >= 1) {
        const permLevel = permLevelObj.valueOf();
        const newRoles = [];

        for (const role of [...msgObj.mentions.roles.values()]) {
            const snowflake = role.id;
            let perm = await Permissions.findOne({
                where: {
                    snowflake
                }
            });

            if (!perm) {
                perm = new Permissions();
                perm.snowflake = snowflake;
            }

            perm.permLevel = permLevel;

            newRoles.push(perm);
        }

        try {
            await Permissions.save(newRoles);
            return await msgObj.reply(`Roles added/updated successfully.`);
        } catch (e) {
            return await msgObj.reply(`Error on Storing new Roles: ${e.message}`);
        }

    } else {
        return msgObj.reply(`Error wrong Usage: !perm add [level] [...mentionsOfRoles]`);
    }
}

async function removePermission(msgObj: Message) {
    if(msgObj.mentions.roles.size >= 1) {
        try {
            const snowsflakes = [];
            for (const role of [...msgObj.mentions.roles.values()]) {
                snowsflakes.push(role.id);
            }

            await Permissions.delete({
                snowflake: In(snowsflakes)
            });
            return await msgObj.reply(`Roles removed successfully.`);
        } catch (e) {
            return await msgObj.reply(`Error on Storing new Roles: ${e.message}`);
        }

    } else {
        return msgObj.reply(`Error wrong Usage: !perm remove [...mentionsOfRoles]`);
    }
}

async function listPermission(msgObj: Message) {
    const allPerms = await Permissions.find();
    const groupsSorted: {[permLevel: number]: string[]} = {
        0: [], 1: [], 2: [], 3: [], 4: []
    };

    const roleCollection = msgObj.guild.roles.cache;

    for (const perm of allPerms) {
        groupsSorted[perm.permLevel].push(`<@&${roleCollection.get(perm.snowflake).id}>`);
    }

    const sendStrings = [];
    for (let i = 1; i <= 4; i++) {
        if (groupsSorted[i].length === 0) {
            sendStrings.push("-")
        } else {
            sendStrings.push(groupsSorted[i].join(", "));
        }
    }

    const embMsg = new MessageEmbed();
    embMsg
        .addField("PermLevel 1 = VIP Functions", sendStrings[0])
        .addField("PermLevel 2 = Moderative Functions", sendStrings[1])
        .addField("PermLevel 3 = Administrative Functions", sendStrings[2])
        .addField("PermLevel 4 = Owner Functions", sendStrings[3]);

    return msgObj.reply({content: "Permission List", embeds: [embMsg]});
}

async function helpPermission(msgObj: Message) {
    return msgObj.reply(`
- !perm add [level] [...mentionsOfRoles] - Adds/updates Roles to permission level   
- !perm remove [...mentionsOfRoles] - Removes Roles  
- !perm list - List all Permission Levels with there groups 
- !perm help - Shows this help`);
}
