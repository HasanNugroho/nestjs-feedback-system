import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { FeedbackStatus } from "src/common/enums/feedback.enum";

export class UpdateStatusFeedbackDto {
    @ApiProperty({ enum: FeedbackStatus, example: FeedbackStatus.REVIEWED })
    @IsEnum(FeedbackStatus)
    status: FeedbackStatus
}