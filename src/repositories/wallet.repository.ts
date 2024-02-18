import { Pool, PoolClient } from "pg"
import { Wallet } from "../models";
import { IWalletRepository } from "./interfaces";
export class WalletRepository implements IWalletRepository {

    private table: string = 'clientes';
    private tableBalance: string = 'saldos';

    getById = async (props: { id: number, conn: PoolClient | Pool }): Promise<Wallet> => {

        try {
            const { id, conn } = props;

            const select = `
                SELECT c.limite, s.valor FROM ${this.table} c
                    INNER JOIN ${this.tableBalance} s ON s.cliente_id = c.id
                WHERE s.id = $1
            `;
            const { rows } = await conn.query(select, [id]);

            return rows?.[0] as Wallet
        } catch (e) {
            console.log("Error", e);
            return {} as Wallet;
        }
    }

    update = async (props: { id: number, value: number, conn: PoolClient | Pool }): Promise<{ valor: number } | null> => {

        try {
            const { id, value, conn } = props;
            const update = `UPDATE ${this.tableBalance} SET valor = valor + $1 WHERE id = $2 RETURNING valor`;
            const result = await conn.query(update, [value, id]);
            return result.rows?.[0];
        } catch (e) {
            console.log("Error", e);
            return null;
        }
    }
}