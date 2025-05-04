import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsOptional } from "class-validator";
import { PaginationOptionsDto } from "src/common/dtos/page-option.dto";
import { FeedbackCategory, FeedbackStatus } from "src/common/enums/feedback.enum";

export class FilterOptionDto extends PaginationOptionsDto {
    @ApiPropertyOptional({ enum: FeedbackCategory, example: FeedbackCategory.BUG_REPORT })
    @IsEnum(FeedbackCategory)
    @IsOptional()
    category?: FeedbackCategory

    @ApiPropertyOptional({ enum: FeedbackStatus, example: FeedbackStatus.PENDING })
    @IsEnum(FeedbackStatus)
    @IsOptional()
    status?: FeedbackStatus

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    start_date?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    end_date?: string;
}