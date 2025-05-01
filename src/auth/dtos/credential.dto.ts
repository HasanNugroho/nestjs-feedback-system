import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class Credentials {
    @ApiProperty({
        description: "email",
        required: true,
    })
    @IsString()
    identifier: string;

    @ApiProperty({
        description: "password",
        required: true,
    })
    @IsString()
    password: string;
}