import { Pool } from "pg";
import { HttpErrorException, HttpException, NotFoundException, UnprocessableEntityException } from "../../exceptions";
import { TransactionRepository, WalletRepository } from "../../repositories";
import { ICreateTransactionService, TransactionProps } from "./interfaces";

export class CreateTransactionService implements ICreateTransactionService {
    private readonly repository: WalletRepository;
    private readonly transactionRepository: TransactionRepository;
    private readonly pool: Pool;
    constructor(props: {
        walletRepository: WalletRepository,
        transactionRepository: TransactionRepository
        pool: Pool
    }) {
        this.repository = props.walletRepository;
        this.transactionRepository = props.transactionRepository;
        this.pool = props.pool
    }

    async execute(props: TransactionProps): Promise<{ statusCode: number, data: any }> {
        const { body, id } = props;

        const conn = await this.pool.connect();


        try {

            const validator = this.validator({ data: body, id });

            if (validator instanceof HttpException) {
                return this.response(validator);
            }

            await conn.query("BEGIN")
            await conn.query("SELECT pg_advisory_xact_lock($1)", [id]);

            const wallet = await this.repository.getById({ id, conn });

            if (!wallet?.limite) {
                await conn.query("COMMIT");
                return this.response(new HttpErrorException({ msg: "invalid Id", httpCode: 404 }))
            }

            const updateValue = this.getValueUpdate({ body, saldo: wallet.valor, limite: wallet.limite });

            if (updateValue instanceof Error) {
                await conn.query("COMMIT");
                return this.response(updateValue);
            }

            await this.transactionRepository.create(
                { description: body.descricao, value: body.valor, type: body.tipo, walletId: id, conn }
            );
            const updatedValue = await this.repository.update({ id, value: updateValue as number, conn })
            await conn.query("COMMIT");

            const data = {
                limite: wallet.limite,
                saldo: updatedValue?.valor,
            }

            return this.response(data);

        } catch (e) {
            await conn.query('ROLLBACK')
            return this.response(e);
        } finally {
            conn.release();
        }
    }

    private validator = (props: { data: any, id: any }): HttpException | null => {
        const { data, id } = props;

        if (!Number.isInteger(id)) {
            return new NotFoundException({ msg: "Invalid ID" })
        }

        if (!data?.valor || !Number.isInteger(data.valor) || Number(data.valor) <= 0) {
            return new UnprocessableEntityException({ msg: "Invalid Body" });
        }

        if (!data?.tipo || !['c', 'd'].includes(data.tipo)) {
            return new UnprocessableEntityException({ msg: "Invalid Body" });
        }

        if (!data?.descricao || data?.descricao.trim() == "" || data.descricao.trim().length > 10) {
            return new UnprocessableEntityException({ msg: "Invalid Body" });
        }

        return null;
    }

    private response(data: any): { statusCode: number, data: any } {

        if (data instanceof HttpException) {
            return {
                statusCode: data.httpCode,
                data: { error: data.error }
            }
        }

        if (data instanceof Error) {

            return {
                statusCode: 500,
                data: { error: "internal server error" }
            }
        }

        return {
            statusCode: 200,
            data: {
                limite: data?.limite,
                saldo: data?.saldo,
            }
        }
    }

    private getValueUpdate(props: { body: any, saldo: number, limite: number }): number | UnprocessableEntityException {
        const { body, saldo, limite } = props;
        let updateValue = body.valor;
        if (body.tipo === 'd') {
            const hasLimit = (Math.abs(saldo - body.valor) > limite)
            if (hasLimit) {
                return new UnprocessableEntityException({ msg: "Invalid value" });
            }
            updateValue = (body.valor * -1)
        }
        return updateValue;

    }
}