import {registerSlashCommand} from "../CommandHandler";
import {SlashCommand} from "../defintions/SlashCommand";
import {SlashCommandBuilder} from "@discordjs/builders";
import {BaseGuildTextChannel, CommandInteraction, CommandInteractionOptionResolver, Interaction} from "discord.js";
import {Birthday} from "../../db/entities/Birthday";
import {getDateString} from "../../utils/DateTime";
import {Raw} from "typeorm";
import {scheduleJob} from "node-schedule";
import {discordClient} from "../Client";

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
                                    .setDescription("Birthday in Format yyyy-mm-dd or dd.mm.yyyy")
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
        calcResponse
    )
);

async function calcResponse(interaction: CommandInteraction) {
    if (!interaction.isCommand()) return;
    const options = interaction.options as CommandInteractionOptionResolver;

    if (options.getSubcommand() === "remove") {
        let oldBirthday = await Birthday.findOne({
            where: {
                snowflake: interaction.user.id
            }
        });

        if (oldBirthday) {
            await oldBirthday.remove();
        }

        return await interaction.reply({content: "Dein Geburtstag wurde aus der Datenbank entfernt.", ephemeral: true});

    } else if (options.getSubcommand() === "set") {
        const birthdayOption = options.getString("birthday", true);
        let date = new Date(birthdayOption);
        if (birthdayOption.indexOf(".") !== -1) {
            const parts = birthdayOption.split(".");
            if (parts.length === 3) {
                date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            }
        }

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

            await (discordClient.channels.cache.get("749318494092394506") as BaseGuildTextChannel)
                .send(`Jemand hat seinen Geburtstag eingetrage. Du willst auch Geburtstagsgrüße? \`Benutze /birthday set\``);
            return await interaction.reply({content: `Dein Geburtstag ${getDateString(date, false, false)} wurde gespeichert`, ephemeral: true});
        } else {
            return await interaction.reply({content: "Incorrect Date Format: Use: YYYY-MM-DD or DD.MM.YYYY - Y is Year, M is Month and D is day of month", ephemeral: true});
        }
    } else if (options.getSubcommand() === "check") {
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

        if (mention.length !== 0 ) {
            await interaction.reply({content: `Heutige Geburtstage: ${mention.join(", ")}`, ephemeral: true});
        } else {
            await interaction.reply({content: `Heute hat niemand Geburtstag... Du hast heute? Setze dein Geburtstag mit \`birthday set\``, ephemeral: true});
        }

    }

}

scheduleJob('0 0 * * *', async function () {
    await sendBirthdays()
});


async function sendBirthdays() {
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
        if (discordClient.users.cache.has(birthday.snowflake)) {
            mention.push(discordClient.users.cache.get(birthday.snowflake).toString());
        }
    }

    if (mention.length !== 0 ) {
        await (discordClient.channels.cache.get("749318494092394506") as BaseGuildTextChannel).send(`Happy Birthday ${mention.join(", ")}`);
    } else {
        if (Math.floor(Math.random() * 10) === 5) {
            await (discordClient.channels.cache.get("749318494092394506") as BaseGuildTextChannel).send(`Heute hat niemand Geburtstag... Du hast heute? Setze dein Geburtstag mit \`birthday set\``);
        }
    }
}