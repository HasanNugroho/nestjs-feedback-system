import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ServiceAdapter } from "src/common/interfaces/service-adapter.interface";
import { User } from "../models/user.model";
import { USER_REPOSITORY } from "src/common/constant";
import { IUserRepository } from "../interfaces/user-repository.interface";

export type UserServiceCommand =
    | { type: 'FIND_BY_EMAIL'; payload: { email: string } }
    | { type: 'FIND_BY_ID'; payload: { id: string } };

@Injectable()
export class UserServiceAdapter implements ServiceAdapter<UserServiceCommand, User | null> {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(command: UserServiceCommand): Promise<User | null> {
        switch (command.type) {
            case 'FIND_BY_EMAIL':
                try {
                    const user = await this.userRepository.findByEmail(command.payload.email);
                    if (!user) {
                        throw new NotFoundException(`User with email ${command.payload.email} not found`);
                    }
                    return user;
                } catch (error) {
                    if (error instanceof NotFoundException || error instanceof BadRequestException) {
                        throw error;
                    }
                    throw new InternalServerErrorException(error.message);
                }
            case 'FIND_BY_ID':
                try {
                    const user = await this.userRepository.findById(command.payload.id);
                    if (!user) {
                        throw new NotFoundException(`User with id ${command.payload.id} not found`);
                    }
                    return user;
                } catch (error) {
                    if (error instanceof NotFoundException || error instanceof BadRequestException) {
                        throw error;
                    }
                    throw new InternalServerErrorException(error.message);
                }
            default:
                throw new Error(`Unsupported command: ${(command as any).type}`);
        }
    }
}