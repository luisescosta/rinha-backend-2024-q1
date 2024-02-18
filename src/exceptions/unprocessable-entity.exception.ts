import { HttpException } from "./http.exception";

export class UnprocessableEntityException extends HttpException {
    public httpCode: number;
    public error: string;
    constructor(props: { msg: string }) {
        super("UnprocessableEntity")
        this.error = props.msg
        this.httpCode = 422
    }
}

