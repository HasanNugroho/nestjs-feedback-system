import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { USER_REPOSITORY, USER_SERVICE } from 'src/common/constant';
import { UserRepository } from './repositories/user.repository';
import { User } from './models/user.model';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [],
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
