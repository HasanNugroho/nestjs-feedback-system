import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Credentials } from '../dtos/credential.dto';
import { IAuthService } from '../interfaces/auth-service.interface';
import { AUTH_SERVICE } from 'src/common/constant';
import { Public } from '../decorators/public.decorator';
import { ApiResponse } from 'src/common/dtos/response.dto';

@Controller('auth')
export class AuthController {
    constructor(
        @Inject(AUTH_SERVICE)
        private readonly authService: IAuthService
    ) { }

    @ApiOperation({ summary: 'Login to the system' })
    @ApiOkResponse({
        description: 'Login successful',
        schema: {
            example: {
                statusCode: 200,
                message: 'OK',
                data: {
                    accessToken: "token",
                    id: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
                }
            }
        }
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid credentials',
        schema: {
            example: {
                statusCode: 401,
                message: 'Unauthorized',
                error: 'Unauthorized',
            },
        },
    })
    @ApiBadRequestResponse({
        description: 'Invalid login request',
        schema: {
            example: {
                statusCode: 400,
                message: 'Bad Request',
                errors: [
                    'email must be an email',
                    'password must be longer than 8 characters',
                ],
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
        schema: {
            example: {
                statusCode: 500,
                message: 'Internal Server Error',
            },
        },
    })
    @Public()
    @Post('login')
    async login(@Body() loginDto: Credentials) {
        const result = await this.authService.login(loginDto);
        return new ApiResponse(HttpStatus.OK, true, "login successfully", result)
    }
}
