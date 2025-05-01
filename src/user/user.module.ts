import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { USER_REPOSITORY, USER_SERVICE } from 'src/common/constant';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.model';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [UserController],
    providers: [
        {
            provide: USER_SERVICE,
            useClass: UserService,
        },
        {
            provide: USER_REPOSITORY,
            useClass: UserRepository,
        },
        UserService
    ],
})
export class UserModule { }
