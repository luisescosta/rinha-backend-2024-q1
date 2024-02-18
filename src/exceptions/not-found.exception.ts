import { HttpException } from "./http.exception";

export class NotFoundException extends HttpException {
    public httpCode: number;
    public error: string;
    constructor(props: { msg: string }) {
        super("NotFound")
        this.error = props.msg
        this.httpCode = 404
    }
}

