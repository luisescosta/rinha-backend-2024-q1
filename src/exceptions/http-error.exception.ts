import { HttpException } from "./http.exception";

class HttpErrorException extends HttpException {
    public error: string;
    public httpCode: number;
    constructor(props: { msg: string, httpCode: number }) {
        super(props.msg)
        this.error = props.msg
        this.httpCode = props.httpCode
    }
}

export { HttpErrorException }