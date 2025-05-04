import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Apply global pipes, filters, and CORS
    configureApp(app);

    // Retrieve app configuration values
    const { name, desc, version, port } = getAppConfig(configService);

    // Set up Swagger
    setupSwagger(app, { name, desc, version });

    // start the server
    await app.listen(port ?? 3000);
}

function configureApp(app) {
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
    }));
    app.enableCors();
    app.useGlobalFilters(new HttpExceptionFilter());
}

function getAppConfig(configService: ConfigService) {
    return {
        name: configService.get('name'),
        desc: configService.get('desc'),
        version: configService.get('version'),
        port: configService.get('port'),
    };
}


function setupSwagger(app, config: { name: string, desc: string, version: string }) {
    const swaggerConfig = new DocumentBuilder()
        .setTitle(config.name)
        .setDescription(config.desc)
        .setVersion(config.version)
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
}

bootstrap();

