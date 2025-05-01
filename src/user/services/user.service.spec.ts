import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { USER_REPOSITORY } from '../../common/constant';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserRole } from 'src/common/enums/role.enum';
import { User } from '../models/user.model';

describe('UserService', () => {
    let service: UserService;
    let repository: jest.Mocked<IUserRepository>;

    beforeEach(async () => {
        const repositoryMock: jest.Mocked<IUserRepository> = {
            findById: jest.fn(),
            findByEmail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: USER_REPOSITORY,
                    useValue: repositoryMock,
                },
                UserService,
            ],
        }).compile();

        repository = module.get(USER_REPOSITORY);
        service = module.get(UserService);
    });

    describe('findById', () => {
        it('should return user when found', async () => {
            const user = new User();
            repository.findById.mockResolvedValueOnce(user);

            const result = await service.findById('user-id');

            expect(result).toBe(user);
            expect(repository.findById).toHaveBeenCalledWith('user-id');
        });

        it('should throw NotFoundException if user not found', async () => {
            repository.findById.mockResolvedValueOnce(null);

            await expect(service.findById('wrong-id')).rejects.toThrow(NotFoundException);
        });

        it('should throw InternalServerErrorException if error', async () => {
            repository.findById.mockRejectedValueOnce(new InternalServerErrorException());

            await expect(service.findById('wrong-id')).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findByEmail', () => {
        it('should return user when found', async () => {
            const user = new User();
            repository.findByEmail.mockResolvedValueOnce(user);

            const result = await service.findByEmail('user-id');

            expect(result).toBe(user);
            expect(repository.findByEmail).toHaveBeenCalledWith('user-id');
        });

        it('should throw NotFoundException if user not found', async () => {
            repository.findByEmail.mockResolvedValueOnce(null);

            await expect(service.findByEmail('wrong-id')).rejects.toThrow(NotFoundException);
        });

        it('should throw InternalServerErrorException if error', async () => {
            repository.findByEmail.mockRejectedValueOnce(new InternalServerErrorException());

            await expect(service.findByEmail('wrong-id')).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('create', () => {
        it('should return user when successfully created user', async () => {
            const createUserDto: CreateUserDto = {
                email: 'newuser@example.com',
                name: 'New User',
                fullname: 'New Full User',
                password: 'password',
                role: UserRole.USER,
            };

            const savedUser = new User();
            savedUser.email = createUserDto.email;
            savedUser.name = createUserDto.name;
            savedUser.fullname = createUserDto.fullname;
            savedUser.role = createUserDto.role;
            savedUser.password = 'hashedPassword';
            savedUser.id = 'new-user-id';

            repository.findByEmail.mockResolvedValueOnce(null);
            repository.create.mockResolvedValueOnce(savedUser);

            const result = await service.create(createUserDto);

            expect(result).toBeDefined();
            expect(result.email).toBe(createUserDto.email);
            expect(repository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
            expect(repository.create).toHaveBeenCalledWith(expect.any(User));
        });

        it('should throw BadRequestException when email exists', async () => {
            const createUserDto: CreateUserDto = {
                email: 'existing@example.com',
                name: 'New User',
                fullname: 'New Full User',
                password: 'password',
                role: UserRole.USER,
            };

            const existingUser = new User();
            existingUser.email = createUserDto.email;

            repository.findByEmail.mockResolvedValueOnce(existingUser);

            await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
            expect(repository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
        });
    });

});
