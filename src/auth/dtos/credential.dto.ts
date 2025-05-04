import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class Credentials {
    @ApiProperty({ example: 'adam@user.com', required: true })
    @IsString()
    identifier: string;

    @ApiProperty({ required: true })
    @IsString()
    password: string;
}