export class ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string | string[];
    data?: T;
    error?: string | string[];

    constructor(
        statusCode: number,
        success: boolean,
        message: string | string[],
        data?: T,
        error?: string | string[],
    ) {
        this.statusCode = statusCode;
        this.success = success;
        this.message = message;
        this.data = data;
        this.error = error;
    }
}
