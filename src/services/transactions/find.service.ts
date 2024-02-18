import { Pool } from "pg";
import { HttpException, NotFoundException } from "../../exceptions";
import { TransactionRepository, WalletRepository } from "../../repositories";
import { FindTransactionProps, FindTransactionResonse, IFindTransactionService } from "./interfaces";

export class FindTransactionService implements IFindTransactionService {
    private readonly transactionRepository: TransactionRepository;
    private readonly walletRepository: WalletRepository;
    private readonly pool: Pool;

    constructor(props: {
        transactionRepository: TransactionRepository,
        walletRepository: WalletRepository
        pool: Pool
    }) {
        this.transactionRepository = props.transactionRepository;
        this.walletRepository = props.walletRepository;
        this.pool = props.pool

    }

    async execute(props: FindTransactionProps): Promise<FindTransactionResonse> {
        const { id } = props;

        const conn = this.pool

        if (!Number.isInteger(id)) {
            return this.response(new NotFoundException({ msg: "invalid id" }));
        }

        const person = await this.walletRepository.getById({ id, conn });

        if (!person?.limite) {
            return this.response(new NotFoundException({ msg: "invalid id" }));
        }
        const transactions = await this.transactionRepository.getById({ id, conn })

        const data = {
            saldo: {
                total: person.valor,
                limite: person.limite,
                data_extrato: new Date().toISOString()
            },
            ultimas_transacoes: transactions
        };

        return this.response(data);
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
            data
        }
    }
}