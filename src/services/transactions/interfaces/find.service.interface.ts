type FindTransactionResonse = { statusCode: number, data: any };
type FindTransactionProps = { id: number }; 

interface IFindTransactionService {
    execute(props: FindTransactionProps): Promise<FindTransactionResonse>
}

export { IFindTransactionService, FindTransactionProps, FindTransactionResonse }