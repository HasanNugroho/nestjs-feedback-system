import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthService } from './interfaces/auth-service.interface';
import { CredentialResponse } from './dtos/credential-response.dto';
import { Credentials } from './dtos/credential.dto';
import { plainToInstance } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ExternalUserServiceAdapter } from './adapters/external-user-service.adapter';

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        private readonly userServiceAdapter: ExternalUserServiceAdapter,

        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async login(credential: Credentials): Promise<CredentialResponse> {
        const credentialInstance = plainToInstance(Credentials, credential);
        const identifier = credentialInstance.identifier;
        const password = credentialInstance.password;

        try {
            const user = await this.userServiceAdapter.findUserByEmail(identifier)
            if (!user) {
                throw new UnauthorizedException('Invalid identifier or password');
            }

            const isPasswordValid = await user.validatePasswordHash(password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid identifier or password');
            }

            return await this.generateTokens(user.id);
        } catch (error) {
            throw new BadRequestException('Invalid identifier or password');
        }
    }

    async logout(): Promise<void> {

    }

    private async generateTokens(id: string): Promise<CredentialResponse> {
        const tokenExpiresIn = this.configService.get<string>('jwt.expired');

        const payload = { id };

        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: tokenExpiresIn,
        });

        return new CredentialResponse(accessToken, id);
    }
}
