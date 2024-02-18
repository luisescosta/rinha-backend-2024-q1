
abstract class HttpException extends Error {
    public httpCode: number;
    abstract error: string;
    constructor(message: string) {
        super(message)
        this.httpCode = 404
    }
}

export { HttpException }