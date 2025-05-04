import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/common/constant';
import { IUserService } from './interfaces/user-service.interface';
import { IUserRepository } from './interfaces/user-repository.interface';
import { ResponseUserDto } from './dtos/response-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './models/user.model';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PaginationOptionsDto } from 'src/common/dtos/page-option.dto';

@Injectable()
export class UserService implements IUserService {
    private readonly logger = new Logger(UserService.name);

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
        } catch (err) {
            this.logger.error(err)
            throw err;
        }
    }

    async findByEmail(email: string): Promise<ResponseUserDto> {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw new NotFoundException(`User with email ${email} not found`);
            }
            return user.toResponse();
        } catch (err) {
            this.logger.error(err)
            throw err;
        }
    }

    async findAll(query: PaginationOptionsDto): Promise<{ users: User[]; totalCount: number; }> {
        try {
            return await this.userRepository.findAll(query);
        } catch (err) {
            this.logger.error(err)
            throw err
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
            this.logger.error(err)
            throw err;
        }
    }

    async update(id: string, param: UpdateUserDto): Promise<void> {
        try {
            const user = await this.userRepository.findById(id);
            if (!user) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }

            if (param.email && user.email !== param.email) {
                const existingEmail = await this.userRepository.findByEmail(param.email);
                if (existingEmail && existingEmail.id !== user.id) {
                    throw new BadRequestException('Email is already in use');
                }
                user.email = param.email;
            }

            user.name = param.name ?? user.name;
            user.fullname = param.fullname ?? user.fullname;
            user.role = param.role ?? user.role;

            // If password is provided, validate and encrypt it
            if (param.password) {
                await user.encryptPassword(param.password);
            }

            await this.userRepository.update(id, user);
        } catch (err) {
            this.logger.error(err)
            throw err;
        }
    }


    async delete(id: string): Promise<void> {
        try {
            const user = await this.userRepository.findById(id);
            if (!user) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }

            await this.userRepository.delete(id);
        } catch (err) {
            this.logger.error(err)
            throw err;
        }
    }
}
