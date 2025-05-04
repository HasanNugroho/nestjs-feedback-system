import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { FeedbackModule } from 'src/feedback/feedback.module';

@Module({
    imports: [FeedbackModule],
    controllers: [],
    providers: [SchedulerService],
})
export class SchedulerModule { }
