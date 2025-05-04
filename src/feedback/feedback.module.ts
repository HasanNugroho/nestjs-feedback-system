import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { FEEDBACK_REPOSITORY_PG, FEEDBACK_SERVICE } from 'src/common/constant';
import { FeedbackPGRepository } from './repositories/feedback-pg.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './models/feedback.model';

@Module({
    imports: [TypeOrmModule.forFeature([Feedback])],
    controllers: [FeedbackController],
    providers: [
        {
            provide: FEEDBACK_SERVICE,
            useClass: FeedbackService,
        },
        {
            provide: FEEDBACK_REPOSITORY_PG,
            useClass: FeedbackPGRepository,
        },
        FeedbackService
    ],
})
export class FeedbackModule { }
