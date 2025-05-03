import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../dtos/response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | string[] = 'Internal server error';
        let error: string | string[] | undefined = undefined;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();

            if (typeof res === 'string') {
                message = res;
            } else if (typeof res === 'object') {
                const { message: msg, error: err } = res as any;
                message = msg ?? message;
                error = err;
            }
        } else if (exception?.message) {
            message = exception.message;
        }

        if (Array.isArray(message)) {
            message = message.map(msg => msg.toString()).join(', ');
        }

        const errorResponse = new ApiResponse(
            status,
            false,
            message,
            undefined,
            error,
        );

        response.status(status).json(errorResponse);
    }
}
