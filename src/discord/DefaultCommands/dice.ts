import {registerCommand, registerSlashCommand} from "../CommandHandler";
import {Command} from "../defintions/Command";
import {CommandInteraction, Message} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {SlashCommand} from "../defintions/SlashCommand";

function dice(sender: Message | CommandInteraction, sides: number, count: number) {
    const numbers = [];
    for (let i = 0; i < count; i++) {
        numbers.push(Math.floor(Math.random() * sides) + 1);
    }

    sender.reply(`Du hast folgende Zahlen mit deinen ${sides}-seitigen Würfel gewürfelt: ${numbers.join(", ")}`);
}


registerCommand(
    new Command(0, ["dice"], async (msgObj: Message, sidesArg: string, countArg: string) => {
        const sides = parseInt(sidesArg) || 6;
        const count = parseInt(countArg) || 1;

        dice(msgObj, sides, count);
    }).setDescription("Wirf einen Würfel!")
);

registerSlashCommand(
    new SlashCommand(
        new SlashCommandBuilder()
            .setName("dice")
            .setDescription("Würfel dein Glück :3")
            .addIntegerOption(
                option => option
                    .setName("count")
                    .setDescription("Wie oft willst du würfeln?")
                    .setRequired(false)
            )
            .addIntegerOption(
                option => option
                    .setName("sides")
                    .setDescription("Wie viele Seiten hat dein Würfel?")
                    .setRequired(false)
            ),
        async (interaction: CommandInteraction) => {
            dice(
                interaction,
                interaction.options.getInteger("sides", false) || 6,
                interaction.options.getInteger("count", false) || 1
            );
        }
    )
);