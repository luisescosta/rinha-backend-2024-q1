import { Pool, PoolClient } from "pg";
import { Wallet } from "../../models";

export interface IWalletRepository {
    getById(props: { id: number, conn: PoolClient | Pool }): Promise<Wallet>;
    update(props: { id: number, value: number, conn: PoolClient | Pool }): Promise<{ valor: number } | null>;
}
