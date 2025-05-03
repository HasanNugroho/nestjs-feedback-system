import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { FeedbackStatus } from "src/common/enums/feedback.enum";

export class UpdateFeedbackDto {
    @ApiProperty({
        description: "status",
        example: "adam"
    })
    @IsEnum(FeedbackStatus)
    status: FeedbackStatus
}