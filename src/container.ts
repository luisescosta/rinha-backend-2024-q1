import { Pool } from "pg";
import { PgPool } from "./config/db.config";
import { TransactionsController } from "./controllers";
import { TransactionRepository, WalletRepository } from "./repositories";
import { CreateTransactionService } from "./services";
import { FindTransactionService } from "./services/transactions/find.service";


export class AppContainer {
    async init() {
        const pool = PgPool() as Pool;
        const walletRepository = new WalletRepository();
        const transactionRepository = new TransactionRepository();
        const createTransactionService = new CreateTransactionService({ walletRepository, transactionRepository, pool });
        const findTransactionService = new FindTransactionService({ walletRepository, transactionRepository, pool });
        const transactionsController = new TransactionsController({ createTransactionService, findTransactionService });

        return {
            transactionsController
        }
    }
}
