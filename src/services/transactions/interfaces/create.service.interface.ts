type TransactionResonse = {statusCode: number, data: { msg?: string, error?: string}};
type TransactionProps = { body: any, id: number }; 

interface ICreateTransactionService {
    execute(props: TransactionProps): Promise<TransactionResonse>
}

export { ICreateTransactionService, TransactionProps, TransactionResonse }