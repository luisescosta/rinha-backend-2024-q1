import { Pool, PoolClient } from "pg";
import { Transaction } from "../../models";

export interface ITransactionRepository {
    create(props: { walletId: number, value: number, type: 'c' | 'd', description: string, conn: PoolClient | Pool }): Promise<boolean>;
    getById(props: { id: number, conn: PoolClient | Pool }): Promise<Transaction[]>;
}