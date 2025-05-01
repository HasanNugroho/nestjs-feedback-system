import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class UuidParamDto {
    @ApiProperty({
        description: "The unique identifier (UUID) for the resource",
        required: true,
    })
    @IsUUID('4', { message: 'The id parameter must be a valid UUID version 4' })
    id: string;
}