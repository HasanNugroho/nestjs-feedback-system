import { Feedback } from "../models/feedback.model";

export class FeedbackCreatedEvent {
    constructor(
        public readonly feedback: Feedback,
        public readonly userId: string,
    ) { }
}
