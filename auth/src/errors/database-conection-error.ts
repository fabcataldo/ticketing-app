import { CustomError } from "./custom-errors";

export class DatabaseConectionError extends CustomError {
    statusCode = 500;
    reason = 'Error conecting to database';
    constructor() {
        super('Error conecting to database');

        Object.setPrototypeOf(this, DatabaseConectionError.prototype);
    }

    serializeErrors() {
        return [
            { message: this.reason }
        ]
    }
}