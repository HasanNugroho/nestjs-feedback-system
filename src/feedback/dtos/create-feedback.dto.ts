import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";
import { FeedbackCategory, FeedbackStatus } from "src/common/enums/feedback.enum";

export class CreateFeedbackDto {
    @ApiProperty({
        description: "message",
        example: "message"
    })
    @IsString()
    message: string

    @ApiProperty({
        description: "category",
        example: "adam"
    })
    @IsEnum(FeedbackCategory)
    category: FeedbackCategory

    @ApiProperty({
        description: "status",
        example: "adam"
    })
    @IsEnum(FeedbackStatus)
    status: FeedbackStatus
}