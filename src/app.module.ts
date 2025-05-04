import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import configuration from './config/app.config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionSource, mongoDSN } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { FeedbackModule } from './feedback/feedback.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.development.local', '.env.development', '.env'],
            load: [configuration],
        }),
        TypeOrmModule.forRoot(connectionSource.options),
        MongooseModule.forRoot(mongoDSN),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'data'),
            exclude: ['/api/{*test}'],
            serveStaticOptions: {
                fallthrough: false,
            },
            serveRoot: '/asset',
        }),
        UserModule,
        AuthModule,
        FeedbackModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
})
export class AppModule { }
