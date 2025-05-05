import { Injectable, Logger } from "@nestjs/common";
import { FeedbackServiceAdapter } from "src/feedback/adapters/feedback-service.adapter";

@Injectable()
export class ExternalFeedbackServiceAdapter {
    private readonly logger = new Logger(ExternalFeedbackServiceAdapter.name);
    constructor(
        private feedbackServiceAdapter: FeedbackServiceAdapter,
    ) { }

    async findUserByID(days: number): Promise<void> {
        try {
            await this.feedbackServiceAdapter.execute({
                type: 'REMINDER_FEEDBACK',
                payload: { days: days }
            });
            this.logger.debug(`Feedback reminder executed successfully with payload: { days: ${days} }`);
        } catch (error) {
            this.logger.error(`Failed to execute feedback reminder: ${error.message}`, error.stack);
            throw error
        }
    }
}