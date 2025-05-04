import { Injectable } from "@nestjs/common";
import { IFeedbackAttachmentRepository } from "../interfaces/feedback-attachment-repository.interface";
import { InjectModel } from "@nestjs/mongoose";
import { FeedbackAttachment } from "../models/feedback-attachment.model";
import { Model } from "mongoose";

@Injectable()
export class FeedbackAttachmentRepository implements IFeedbackAttachmentRepository {
    constructor(
        @InjectModel(FeedbackAttachment.name)
        private attachmentModel: Model<FeedbackAttachment>
    ) { }

    async saveAttachments(files: FeedbackAttachment[]): Promise<void> {
        await this.attachmentModel.insertMany(files);
    }

    async findByFeedbackId(feedbackId: string): Promise<FeedbackAttachment[]> {
        return this.attachmentModel.find({ feedbackId }).exec();
    }

    async findByFeedbackIds(feedbackIds: string[]): Promise<FeedbackAttachment[]> {
        return this.attachmentModel.find({ feedbackId: { $in: feedbackIds } }).exec()
    }
}