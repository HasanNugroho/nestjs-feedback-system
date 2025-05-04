import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FeedbackServiceAdapter } from 'src/feedback/adapters/feedback-service.adapter';

@Injectable()
export class SchedulerService {
    private readonly logger = new Logger(SchedulerService.name);

    constructor(
        private feedbackServiceAdapter: FeedbackServiceAdapter,
        private configService: ConfigService,
    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleFeedbackReminderCron() {
        const defaultDays = this.configService.get<number>('reminder.defaultDays') ?? 7;
        try {
            await this.feedbackServiceAdapter.execute({
                type: 'REMINDER_FEEDBACK',
                payload: { days: defaultDays }
            });
            this.logger.debug(`Feedback reminder executed successfully with payload: { days: ${defaultDays} }`);
        } catch (error) {
            this.logger.error(`Failed to execute feedback reminder: ${error.message}`, error.stack);
        }
    }
}
