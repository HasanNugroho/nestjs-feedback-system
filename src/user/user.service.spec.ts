import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserRoles } from 'src/common/enums/role.enum';
import { IUserRepository } from './interfaces/user-repository.interface';
import { USER_REPOSITORY } from 'src/common/constant';
import { User } from './models/user.model';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

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
        it('should return user when found by id', async () => {
            const user = new User();
            repository.findById.mockResolvedValueOnce(user);

            const result = await service.findById('user-id');

            expect(result).toEqual(user);
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
        it('should return user when found by email', async () => {
            const user = new User();
            repository.findByEmail.mockResolvedValueOnce(user);

            const result = await service.findByEmail('user-id');

            expect(result).toEqual(user);
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
                role: UserRoles.USER,
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
                role: UserRoles.USER,
            };

            const existingUser = new User();
            existingUser.email = createUserDto.email;

            repository.findByEmail.mockResolvedValueOnce(existingUser);

            await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
            expect(repository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
        });
    });

    describe('update', () => {
        it('should update user successfully ', async () => {
            const savedUser = new User();
            savedUser.email = "exist@example.com";
            savedUser.name = "Existing User";
            savedUser.fullname = "Existing Full User";
            savedUser.role = UserRoles.USER;
            savedUser.password = '$2a$12$dU41iYBbB2BQXVVnoY6iauuVS9WZfst5wYV8KLyW9ltH3mZZR.cH.';
            savedUser.id = 'existing-user-id';

            const updatesUserDto: UpdateUserDto = {
                email: 'exist@example.com',
                name: 'New User',
                fullname: 'New Full User',
                password: 'password',
                role: UserRoles.USER,
            };

            repository.findById.mockResolvedValueOnce(savedUser);
            repository.update.mockResolvedValueOnce(undefined);

            const result = await service.update(savedUser.id, updatesUserDto);

            expect(result).toBe(undefined);
        });

        it('should not return when change email successfully ', async () => {
            const savedUser = new User();
            savedUser.email = "exist@example.com";
            savedUser.name = "Existing User";
            savedUser.fullname = "Existing Full User";
            savedUser.role = UserRoles.USER;
            savedUser.password = '$2a$12$dU41iYBbB2BQXVVnoY6iauuVS9WZfst5wYV8KLyW9ltH3mZZR.cH.';
            savedUser.id = 'existing-user-id';

            const updatesUserDto: UpdateUserDto = {
                email: 'new-email@example.com',
                name: 'New User',
                fullname: 'New Full User',
                password: 'password',
                role: UserRoles.USER,
            };

            repository.findById.mockResolvedValueOnce(savedUser);
            repository.findByEmail.mockResolvedValueOnce(null);
            repository.update.mockResolvedValueOnce(undefined);

            const result = await service.update(savedUser.id, updatesUserDto);

            expect(result).toEqual(undefined);
            expect(repository.findByEmail).toHaveBeenCalledWith('new-email@example.com');
        });

        it('should throw BadRequestException when changed email duplicate ', async () => {
            const savedUser = new User();
            savedUser.email = "exist@example.com";
            savedUser.name = "Existing User";
            savedUser.fullname = "Existing Full User";
            savedUser.role = UserRoles.USER;
            savedUser.password = '$2a$12$dU41iYBbB2BQXVVnoY6iauuVS9WZfst5wYV8KLyW9ltH3mZZR.cH.';
            savedUser.id = 'existing-user-id';

            const updatesUserDto: UpdateUserDto = {
                email: 'new-email@example.com',
                name: 'New User',
                fullname: 'New Full User',
                password: 'password',
                role: UserRoles.USER,
            };

            const existingEmailUser = new User();
            existingEmailUser.email = "new-email@example.com";
            existingEmailUser.id = 'another-user-id'; // pastikan id berbeda!

            repository.findById.mockResolvedValueOnce(savedUser);
            repository.findByEmail.mockResolvedValueOnce(existingEmailUser);

            await expect(service.update(savedUser.id, updatesUserDto)).rejects.toThrow(BadRequestException);
        });
    });

});
