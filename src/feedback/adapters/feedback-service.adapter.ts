import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ServiceAdapter } from "src/common/interfaces/service-adapter.interface";
import { FEEDBACK_SERVICE } from "src/common/constant";
import { Feedback } from "../models/feedback.model";
import { IFeedbackService } from "../interfaces/feedback-service.interface";
import { IUser } from "src/common/interfaces/user.interface";

export type FeedbackServiceCommand =
    | { type: 'REMINDER_FEEDBACK'; payload: { days: number } }

@Injectable()
export class FeedbackServiceAdapter implements ServiceAdapter<FeedbackServiceCommand, Feedback | Feedback[] | IUser[] | null> {
    constructor(
        @Inject(FEEDBACK_SERVICE)
        private readonly feedbackService: IFeedbackService,
    ) { }

    async execute(command: FeedbackServiceCommand): Promise<Feedback | Feedback[] | IUser[] | null> {
        switch (command.type) {
            case 'REMINDER_FEEDBACK':
                return this.reminderUser(command.payload.days);

            default:
                throw new Error(`Unsupported command type: ${(command as FeedbackServiceCommand).type}`);
        }
    }

    private async reminderUser(days: number): Promise<IUser[] | null> {
        try {
            const Feedback = await this.feedbackService.reminderUser(days);
            if (!Feedback) {
                throw new NotFoundException(`No feedback found for the specified criteria`);
            }
            return Feedback;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('An unexpected error occurred');
        }
    }
}
