import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { EventName } from 'src/common/enums/event-name.enum';

@Injectable()
export class FeedbackEventsListener {
    private readonly logger = new Logger(FeedbackEventsListener.name);

    @OnEvent(EventName.FEEDBACK_CREATED, { async: true })
    handleFeedbackCreatedEvent(payload: any) {
        this.logger.log(`Feedback created by user ${payload.userId}`);
    }

    @OnEvent(EventName.FEEDBACK_REMINDER, { async: true })
    handleFeedbackReminderEvent(payload: any) {
        payload.users.map(user => {
            this.logger.log(`reminder feedback for user ${user.email}`);
        })
    }

}
