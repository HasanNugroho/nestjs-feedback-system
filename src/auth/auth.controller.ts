import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Credentials } from './dtos/credential.dto';
import { IAuthService } from './interfaces/auth-service.interface';
import { AUTH_SERVICE } from 'src/common/constant';

@Controller('auth')
export class AuthController {
    constructor(
        @Inject(AUTH_SERVICE)
        private readonly authService: IAuthService
    ) { }

    @ApiOperation({ summary: 'Endpoint untuk login' })
    @ApiOkResponse({
        description: "Response success login",
    })
    @ApiUnauthorizedResponse({
        description: "Bad request",
    })
    @Post('login')
    login(@Body() loginDto: Credentials) {
        return this.authService.login(loginDto);
    }
}
