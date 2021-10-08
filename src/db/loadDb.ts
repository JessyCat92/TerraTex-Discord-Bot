import {createConnection} from "typeorm";

export async function loadDb() {
    await createConnection({
        name: "default",
        type: "mariadb",
        database: process.env.DB_DATABASE,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST || "localhost",
        synchronize: true,
        logging: false,
        entities: [
            "src/db/entities/*"
        ],
        subscribers: [
            "src/db/subscriber/*"
        ],
        migrations: [
            "src/db/migration/*"
        ],
        cli: {
            entitiesDir: "src/db/entities",
            migrationsDir: "src/db/migration",
            subscribersDir: "src/db/subscriber"
        }
    });
}