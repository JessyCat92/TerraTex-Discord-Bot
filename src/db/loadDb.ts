import {createConnection} from "typeorm";

export async function loadDb() {
    await createConnection();
}