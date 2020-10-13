import {config} from "dotenv";
import {loadDb} from "./db/loadDb";
import {initDiscordClient} from "./discord/Client";

config();

async function startApplication() {
    await loadDb();
    await initDiscordClient();

}
startApplication()
    .then(() => console.info("started application successfully"))
    .catch(e => console.error(e));