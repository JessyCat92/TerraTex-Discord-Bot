import {createConnection} from "typeorm";

export async function loadDb() {
    await createConnection({
        name: "default",
        type: "mariadb",
        database: process.env.DB_DATABASE,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        synchronize: true,
        logging: false,
        entities: [
            "src/db/entity/*"
        ],
        subscribers: [
            "src/db/subscriber/*"
        ],
        migrations: [
            "src/db/migration/*"
        ],
        cli: {
            entitiesDir: "src/db/entity",
            migrationsDir: "src/db/migration",
            subscribersDir: "src/db/subscriber"
        }
    });
}