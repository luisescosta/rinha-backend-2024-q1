import { Pool, PoolClient } from "pg";
import { Transaction } from "../models";

export class TransactionRepository {

    private table: string = "transacoes";

    create = async (props: { walletId: number, value: number, type: 'c' | 'd', description: string, conn: PoolClient | Pool }): Promise<boolean> => {
        const { description, type, value, walletId, conn } = props;
        try {
            const insert = `
                INSERT INTO ${this.table} 
                    (cliente_id, valor, tipo, descricao, realizada_em)
                VALUES
                    ($1, $2, $3, $4, $5)`;
            await conn.query(insert, [walletId, value, type, description, new Date().toISOString()])
            return true;
        } catch (e) {
            console.log("Error", e)
            return false
        }
    }

    getById = async (props: { id: number, conn: PoolClient | Pool }): Promise<Transaction[]> => {
        const { id, conn } = props;
        try {
            const select = `
                SELECT t.valor, t.tipo, t.descricao, t.realizada_em FROM ${this.table} t 
                    WHERE t.cliente_id = $1
                ORDER BY t.id DESC
                LIMIT 10
            `;
            const result = await conn.query(select, [id]);
            return result?.rows;
        } catch (e) {
            console.log("Error", e);
            return [];
        }
    }
}