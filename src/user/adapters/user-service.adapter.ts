import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ServiceAdapter } from "src/common/interfaces/service-adapter.interface";
import { User } from "../models/user.model";
import { USER_REPOSITORY } from "src/common/constant";
import { IUserRepository } from "../interfaces/user-repository.interface";

export type UserServiceCommand =
    | { type: 'FIND_BY_EMAIL'; payload: { email: string } }
    | { type: 'FIND_BY_ID'; payload: { id: string } }
    | { type: 'GET_ALL_MINIMAL' };

@Injectable()
export class UserServiceAdapter implements ServiceAdapter<UserServiceCommand, User | User[] | null> {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(command: UserServiceCommand): Promise<User | User[] | null> {
        switch (command.type) {
            case 'FIND_BY_EMAIL':
                return this.findByEmail(command.payload.email);

            case 'FIND_BY_ID':
                return this.findById(command.payload.id);

            case 'GET_ALL_MINIMAL':
                return this.getAllMinimal();

            default:
                throw new Error(`Unsupported command type: ${(command as UserServiceCommand).type}`);
        }
    }

    private async findByEmail(email: string): Promise<User | null> {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw new NotFoundException(`User with email ${email} not found`);
            }
            return user;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('An unexpected error occurred');
        }
    }

    private async findById(id: string): Promise<User | null> {
        try {
            const user = await this.userRepository.findById(id);
            if (!user) {
                throw new NotFoundException(`User with id ${id} not found`);
            }
            return user;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('An unexpected error occurred');
        }
    }

    private async getAllMinimal(): Promise<User[] | null> {
        try {
            const users = await this.userRepository.getAllUsersMinimalData();
            if (users.length === 0) {
                throw new NotFoundException(`No users found`);
            }
            return users;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('An unexpected error occurred');
        }
    }
}
