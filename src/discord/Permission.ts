import {Message} from "discord.js";
import {Permissions} from "../db/entities/Permissions";
import {MoreThanOrEqual} from "typeorm";

export async function hasPermissionLevel(msg: Message, level: number): Promise<boolean> {
    if (level === 0)
        return true;
    if (level === 4) {
        if (msg.author.id === msg.guild.ownerId) return true;
    }

    const allowedPermissions = await Permissions.find({
        where: {
            permLevel: MoreThanOrEqual(level)
        }
    });

    for(const perm of allowedPermissions) {
        if (msg.member.roles.cache.has(perm.snowflake)) {
            return true;
        }
    }

    return false;
}

