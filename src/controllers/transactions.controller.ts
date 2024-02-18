import { Request, Response } from "express";
import { ICreateTransactionService } from "../services/transactions/interfaces";
import { FindTransactionService } from "../services/transactions/find.service";

export class TransactionsController {

    private readonly createTransactionService: ICreateTransactionService;
    private readonly findTransactionService: FindTransactionService
    
    
    constructor(props: {createTransactionService: ICreateTransactionService, findTransactionService: FindTransactionService}){
        this.createTransactionService = props.createTransactionService
        this.findTransactionService = props.findTransactionService
    }
    
    create = async (req: Request, res: Response): Promise<any> => {
        const data = await this.createTransactionService.execute({body: req.body, id: Number(req.params.id)});
        return res.status(data.statusCode).json(data.data);
    }
    
    findById = async (req: Request, res: Response): Promise<any> => {
        const data = await this.findTransactionService.execute({id: Number(req.params.id)});
        return res.status(data.statusCode).json(data.data);
    }  
}
