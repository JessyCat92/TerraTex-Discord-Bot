import {DataSource} from "typeorm";


export let AppDataSource: DataSource;

export async function loadDb() {
    AppDataSource = new DataSource({
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
        ]
    });
    await AppDataSource.initialize();
}