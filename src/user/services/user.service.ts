import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { IUserService } from '../interfaces/user-service.interface';
import { User } from '../models/user.model';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { USER_REPOSITORY } from 'src/common/constant';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { ResponseUserDto } from '../dtos/response-user.dto';

@Injectable()
export class UserService implements IUserService {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) { }

    async findById(id: string): Promise<ResponseUserDto> {
        try {
            const user = await this.userRepository.findById(id);
            if (!user) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }
            return user.toResponse();
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async findByEmail(email: string): Promise<ResponseUserDto> {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw new NotFoundException(`User with email ${email} not found`);
            }
            return user.toResponse();
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async create(param: CreateUserDto): Promise<ResponseUserDto> {
        try {
            const existingUser = await this.userRepository.findByEmail(param.email);
            if (existingUser) {
                throw new BadRequestException('Email is already in use');
            }

            const user = new User()
            user.email = param.email;
            user.name = param.name;
            user.fullname = param.fullname;
            user.role = param.role;

            await user.encryptPassword(param.password);

            return (await this.userRepository.create(user)).toResponse();
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    async update(id: string, param: UpdateUserDto): Promise<void> {
        try {
            const user = await this.userRepository.findById(id);
            if (!user) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }

            // Update the user fields
            user.name = param.name || user.name;
            user.fullname = param.fullname || user.fullname;

            if (param.email) {
                const existingEmail = await this.userRepository.findByEmail(param.email);
                if (existingEmail && existingEmail.id !== id) {
                    throw new BadRequestException('Email is already in use');
                }
                user.email = param.email || user.email;
            }

            if (param.role) {
                user.role = param.role || user.role;
            }

            // If password is provided, validate and encrypt it
            if (param.password) {
                user.validatePasswordHash(param.password);
                await user.encryptPassword(param.password);
            }

            await this.userRepository.update(id, user);

            const updatedUser = await this.userRepository.update(id, user);
            if (!updatedUser) {
                throw new NotFoundException(`Failed to update user with ID ${id}`);
            }
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }


    async delete(id: string): Promise<void> {
        try {
            const user = await this.userRepository.findById(id);
            if (!user) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }

            await this.userRepository.delete(id);
        } catch (error) {
            throw new BadRequestException('Failed to delete user');
        }
    }
}
