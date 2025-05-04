import { FeedbackAttachment } from "../models/feedback-attachment.model";

export interface IFeedbackAttachmentRepository {
    /**
     * Saves one or more attachments related to a specific feedback entry.
     * @param files - An array of attachment objects to be saved.
     */
    saveAttachments(files: Partial<FeedbackAttachment>[]): Promise<void>;

    /**
     * Retrieves all attachments for a single feedback ID.
     * @param feedbackId - The ID of the feedback.
     * @returns An array of FeedbackAttachment objects.
     */
    findByFeedbackId(feedbackId: string): Promise<FeedbackAttachment[]>;

    /**
     * Retrieves all attachments for multiple feedback IDs.
     * @param feedbackIds - An array of feedback IDs.
     * @returns An array of FeedbackAttachment objects.
     */
    findByFeedbackIds(feedbackIds: string[]): Promise<FeedbackAttachment[]>;
}
