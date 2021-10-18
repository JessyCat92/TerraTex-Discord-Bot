import {registerSlashCommand} from "../CommandHandler";
import {SlashCommand} from "../defintions/SlashCommand";
import {SlashCommandBuilder} from "@discordjs/builders";
import {Interaction} from "discord.js";
import {Birthday} from "../../db/entities/Birthday";
import {getDateString} from "../../utils/DateTime";
import {Raw} from "typeorm";

registerSlashCommand(
    new SlashCommand(new SlashCommandBuilder()
            .setDescription("Ist Feiertag / Welcher ist der nächste?")
            .setName("birthday")
            .addSubcommand(
                subCommand =>
                    subCommand
                        .setDescription("Set your Birthday")
                        .setName("set")
                        .addStringOption(
                            option =>
                                option
                                    .setName("birthday")
                                    .setDescription("Birthday in Format yyyy-mm-dd")
                                    .setRequired(true)
                        )
            )
            .addSubcommand(
                subCommand => subCommand
                    .setDescription("Remove your Birthday")
                    .setName("remove")
            )
            .addSubcommand(
                subCommand => subCommand
                    .setDescription("Remove your Birthday")
                    .setName("check")
            )
        ,
        async interaction => {
            await calcResponse(interaction);
        }
    )
);

async function calcResponse(interaction: Interaction) {
    if (!interaction.isCommand()) return;

    if (interaction.options.getSubcommand() === "remove") {
        let oldBirthday = await Birthday.findOne({
            where: {
                snowflake: interaction.user.id
            }
        });

        if (oldBirthday) {
            await oldBirthday.remove();
        }

        return await interaction.reply("Dein Geburtstag wurde aus der Datenbank entfernt.");

    } else if (interaction.options.getSubcommand() === "set") {
        const date = new Date(interaction.options.getString("birthday", true));
        if ((date >= new Date("1900-01-01") && date <= new Date())) {
            let oldBirthday = await Birthday.findOne({
                where: {
                    snowflake: interaction.user.id
                }
            });

            if (!oldBirthday) {
                oldBirthday = new Birthday()
                    .setSnowflake(interaction.user.id)
                    .setBirthday(date);
            } else {
                oldBirthday.setBirthday(date);
            }

            await oldBirthday.save();

            // @ts-ignore
            return await interaction.reply(`Dein Geburtstag ${getDateString(date, false, false)} wurde gespeichert`);
        } else {
            return await interaction.reply("Incorrect Date Format: Use: YYYY-MM-DD - Y is Year, M is Month and D is day of month");
        }
    } else if (interaction.options.getSubcommand() === "check") {
        let allBirthday = await Birthday.find({
            where: {
                birthday:
                    Raw(
                        (alias) => {
                            return `MONTH(${alias}) = MONTH(Now()) AND DAY(${alias}) = DAY(Now())`;
                        }
                    )
            }
        });

        const mention = [];
        for (const birthday of allBirthday) {
            // birthday.snowflake
            if (interaction.guild.members.cache.has(birthday.snowflake)) {
                mention.push(interaction.guild.members.cache.get(birthday.snowflake).user.toString());
            }
        }

        // interaction.channel.send(`Happy Birthday ${mention.join(", ")}`);
        await interaction.reply(`Heutige Geburtstage: ${mention.join(", ")}`)
    }

}

// @todo: automatic send happy birthday

// SELECT MONTH(birthday.birthday), ,DAY(Now()), Day(birthday.birthday) FROM birthday;