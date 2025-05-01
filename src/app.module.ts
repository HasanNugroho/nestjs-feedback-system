import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import configuration from './config/app.config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionSource } from './config/database.config';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.development.local', '.env.development', '.env'],
            load: [configuration],
        }),
        TypeOrmModule.forRoot(connectionSource.options),
        UserModule,
        AuthModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
