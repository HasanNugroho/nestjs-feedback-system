import { UploadedFiles } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { FeedbackCategory, FeedbackStatus } from "src/common/enums/feedback.enum";

export class CreateFeedbackDto {
    @ApiProperty({ example: "message" })
    @IsString()
    message: string

    @ApiProperty({ enum: FeedbackCategory, example: FeedbackCategory.BUG_REPORT })
    @IsEnum(FeedbackCategory)
    category: FeedbackCategory

    @ApiProperty({
        type: 'array',
        items: { type: 'string', format: 'binary' },
        required: false,
        description: 'Attachment files (optional)',
    })
    files?: any[];
}