import {registerCommand, cmdList} from "../CommandHandler"
import {Command} from "../defintions/Command";

registerCommand(
    new Command(0, ["lt"], async function (msg) {
        const authorId = msg.author.id;
        const mentionIds = [];
        let sum = 0;

        for (const id of msg.mentions.users.keys()) {
            if (mentionIds.indexOf(id) === -1) {
                mentionIds.push(id);
                sum += Number(id);
            }
        }

        await msg.reply(`Power of Love = ${querSumme(sum)} %`);

    })
)

function querSumme(number) {
    let sum = 0;
    for (const digit of number.toString()) {
        sum += Number(digit);
    }

    if (sum > 100) {
        sum = querSumme(sum);
    }

    return sum;
}