const {
    PORT,
    DB_NAME,
    DB_PASS,
    DB_PORT,
    DB_HOST,
    DB_USER
} = process.env;

type Env = {
    port: number
    dbName: string
    dbUser: string
    dbPass: string
    dbPort: number
    dbHost: string;
}

export const envs: Env = {
    port: Number(PORT),
    dbHost: DB_HOST as string,
    dbName: DB_NAME as string,
    dbUser: DB_USER as string,
    dbPass: DB_PASS as string,
    dbPort: Number(DB_PORT),
} 