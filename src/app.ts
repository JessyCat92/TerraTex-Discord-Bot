import {loadDb} from "./db/loadDb";
import {initDiscordClient} from "./discord/Client";
import * as fs from "fs";

async function startApplication() {
    const file = fs.readFileSync(".env").toString("utf-8");
    const regex = /(?<key>[a-z].*)=(?<value>.*)/gi;
    const result = Array.from(file.matchAll(regex));
    for (const k in result) {
        process.env[result[k].groups.key] = result[k].groups.value;
    }

    await loadDb();
    await initDiscordClient();

}
startApplication()
    .then(() => console.info("started application successfully"))
    .catch(e => console.error(e));