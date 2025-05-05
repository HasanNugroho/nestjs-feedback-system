import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Credentials } from './dtos/credential.dto';
import { CredentialResponse } from './dtos/credential-response.dto';
import { ExternalUserServiceAdapter } from './adapters/external-user-service.adapter';
import { IAuthService } from './interfaces/auth-service.interface';

@Injectable()
export class AuthService implements IAuthService {
    private readonly logger = new Logger(AuthService.name);

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

            if (!user || !(await user.validatePasswordHash(password))) {
                throw new UnauthorizedException('Invalid identifier or password');
            }

            return await this.generateTokens(user.id);
        } catch (error) {
            this.logger.error(error)
            if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
                throw error
            }

            if (error instanceof NotFoundException) {
                throw new UnauthorizedException('Invalid identifier or password');

            }

            throw new InternalServerErrorException('internal server error');
        }
    }

    private async generateTokens(id: string): Promise<CredentialResponse> {
        const payload = { id };
        const tokenExpiresIn = this.configService.get<string>('jwt.expired');
        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: tokenExpiresIn,
        });

        return new CredentialResponse(accessToken, id);
    }
}
