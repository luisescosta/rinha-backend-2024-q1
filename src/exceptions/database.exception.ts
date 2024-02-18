import { HttpException } from "./http.exception";

export class DatabaseException extends HttpException {
    public httpCode: number;
    public error: string;
    constructor() {
        super("Database")
        this.error = "Database Error"
        this.httpCode = 500
    }
}

