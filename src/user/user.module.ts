import { Module } from '@nestjs/common';
import { USER_REPOSITORY, USER_SERVICE } from 'src/common/constant';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.model';
import { UserServiceAdapter } from './adapters/user-service.adapter';
import { UserService } from './user.service';

const userRepoProvider = {
    provide: USER_REPOSITORY,
    useClass: UserRepository,
};

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [
        {
            provide: USER_SERVICE,
            useClass: UserService,
        },
        userRepoProvider,
        UserService,
        UserServiceAdapter,
    ],
    exports: [userRepoProvider, UserServiceAdapter],
})
export class UserModule { }
