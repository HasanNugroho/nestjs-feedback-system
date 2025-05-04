import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ExternalUserServiceAdapter } from './adapters/external-user-service.adapter';
import { Credentials } from './dtos/credential.dto';
import { CredentialResponse } from './dtos/credential-response.dto';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserRoles } from 'src/common/enums/role.enum';
import { User } from 'src/user/models/user.model';
import { TestBed, Mocked } from '@suites/unit';

describe('AuthService', () => {
    let authService: AuthService;
    let userServiceAdapter: Mocked<ExternalUserServiceAdapter>;
    let jwtService: Mocked<JwtService>;

    beforeEach(async () => {
        const { unit, unitRef } = await TestBed.solitary(AuthService).compile();

        authService = unit;
        userServiceAdapter = unitRef.get(ExternalUserServiceAdapter);
        jwtService = unitRef.get<JwtService>(JwtService);
    });

    describe('login', () => {
        it('should return access token and id when credentials are valid', async () => {
            const mockUser = new User();
            mockUser.email = "test@example.com";
            mockUser.name = "Test User";
            mockUser.fullname = "Test Fullname";
            mockUser.role = UserRoles.USER;
            mockUser.password = '$2a$10$jDqaXgSyl59QQLmoS2qRVeBX1nqsCSU2ZcfLfM/ST5akQhzPJHpqi';
            mockUser.id = 'user123';

            userServiceAdapter.findUserByEmail.mockResolvedValue(mockUser);
            jwtService.signAsync.mockResolvedValue('token123');

            const credentials = new Credentials();
            credentials.identifier = 'test@example.com';
            credentials.password = 'password';

            const result = await authService.login(credentials);

            expect(result).toEqual(new CredentialResponse('token123', 'user123'));
        });

        it('should throw UnauthorizedException if user not found', async () => {
            userServiceAdapter.findUserByEmail.mockResolvedValue(null);

            const credentials = new Credentials();
            credentials.identifier = 'notfound@example.com';
            credentials.password = 'password';

            await expect(authService.login(credentials)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if password is invalid', async () => {
            const mockUser = new User();
            mockUser.email = "test@example.com";
            mockUser.name = "Test User";
            mockUser.fullname = "Test Fullname";
            mockUser.role = UserRoles.USER;
            mockUser.password = '$2a$10$jDqaXgSyl59QQLmoS2qRVeBX1nqsCSU2ZcfLfM/ST5akQhzPJHpqi';
            mockUser.id = 'user123';

            userServiceAdapter.findUserByEmail.mockResolvedValue(mockUser);

            const credentials = new Credentials();
            credentials.identifier = 'test@example.com';
            credentials.password = 'wrongpassword';

            await expect(authService.login(credentials)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw InternalServerErrorException for unexpected errors', async () => {
            userServiceAdapter.findUserByEmail.mockRejectedValue(new Error('Unexpected'));

            const credentials = new Credentials();
            credentials.identifier = 'test@example.com';
            credentials.password = 'password';

            await expect(authService.login(credentials)).rejects.toThrow(InternalServerErrorException);
        });
    });
});
