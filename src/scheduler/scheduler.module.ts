import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { FeedbackModule } from 'src/feedback/feedback.module';
import { ExternalFeedbackServiceAdapter } from './adapters/external-feedback-service.adapter';

@Module({
    imports: [FeedbackModule],
    providers: [SchedulerService, ExternalFeedbackServiceAdapter],
})
export class SchedulerModule { }
