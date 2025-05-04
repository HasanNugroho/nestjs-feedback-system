import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class FeedbackAttachment extends Document {
    @Prop({ required: true })
    feedbackId: string;

    @Prop({ required: true })
    fileName: string;

    @Prop({ required: true })
    mimetype: string;

    @Prop({ required: true })
    path: string;

    @Prop({ required: true })
    size: string;
}