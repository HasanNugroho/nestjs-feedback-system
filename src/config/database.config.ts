import { config as dotenvConfig } from 'dotenv';
import path from "path";
import { DataSource, DataSourceOptions } from "typeorm";

dotenvConfig({ path: '.env' });

const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [path.join(__dirname, '/../**/models/*.model{.ts,.js}')],
    synchronize: false,
    logging: process.env.NODE_ENV !== 'production',
};

export const connectionSource = new DataSource(dataSourceOptions);