import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { FEEDBACK_ATTACHMENT_REPOSITORY, FEEDBACK_REPOSITORY, FEEDBACK_SERVICE } from 'src/common/constant';
import { FeedbackPGRepository } from './repositories/feedback.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './models/feedback.model';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackAttachment, FeedbackAttachmentSchema } from './models/feedback-attachment.model';
import { FeedbackAttachmentRepository } from './repositories/feedback-attachment.repository';
import { ExternalUserServiceAdapter } from './adapters/external-user-service.adapter';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Feedback]),
        MongooseModule.forFeature([
            { name: FeedbackAttachment.name, schema: FeedbackAttachmentSchema },
        ]),
        MulterModule.register({
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const uploadPath = path.join(__dirname, '..', '..', 'data');

                    if (!fs.existsSync(uploadPath)) {
                        fs.mkdirSync(uploadPath, { recursive: true });

                        const indexFilePath = path.join(uploadPath, 'index.html');
                        const html403 = `
                            <!DOCTYPE html>
                            <html lang="en">
                            <head>
                                <meta charset="UTF-8">
                                <title>403 Forbidden</title>
                            </head>
                            <body>
                                <h1>403 Forbidden</h1>
                                <p>You don't have permission to access this directory.</p>
                            </body>
                            </html>
                            `;
                        fs.writeFileSync(indexFilePath, html403.trim());
                    }

                    cb(null, uploadPath);
                },
                filename: (req, file, cb) => {
                    const filename = `${Date.now()}-${file.originalname}`;
                    cb(null, filename);
                },
            }),
        }),
        UserModule
    ],
    controllers: [FeedbackController],
    providers: [
        {
            provide: FEEDBACK_SERVICE,
            useClass: FeedbackService,
        },
        {
            provide: FEEDBACK_REPOSITORY,
            useClass: FeedbackPGRepository,
        },
        {
            provide: FEEDBACK_ATTACHMENT_REPOSITORY,
            useClass: FeedbackAttachmentRepository,
        },
        ExternalUserServiceAdapter,
        FeedbackService
    ],
})
export class FeedbackModule { }
