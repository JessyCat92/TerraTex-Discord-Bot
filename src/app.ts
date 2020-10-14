import {loadDb} from "./db/loadDb";
import {initDiscordClient} from "./discord/Client";
import * as fs from "fs";
import moment from "moment";
import "moment/locale/de";

async function startApplication() {
    // load enviroment
    const file = fs.readFileSync(".env").toString("utf-8");
    const regex = /(?<key>[a-z].*)=(?<value>.*)/gi;
    const result = Array.from(file.matchAll(regex));
    for (const k in result) {
        process.env[result[k].groups.key] = result[k].groups.value;
    }
    //set moment locale
    moment.locale("de");

    await loadDb();
    await initDiscordClient();

}
startApplication()
    .then(() => console.info("started application successfully"))
    .catch(e => console.error(e));