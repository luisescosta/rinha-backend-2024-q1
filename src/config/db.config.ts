import pg, { Pool } from 'pg'
import { envs } from './envs.config';

const PgPool = () => {
    try {
        const pool: Pool = new pg.Pool({
            host: envs.dbHost,
            port: envs.dbPort,
            database: envs.dbName,
            user: envs.dbUser,
            password: envs.dbPass,
            idleTimeoutMillis: 0,
            max: 50,
            min: 3,
        });
        return pool;
    } catch {
        console.log("Error to connect database");
    }
}

export { PgPool }