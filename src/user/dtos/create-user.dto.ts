import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsString, MinLength } from "class-validator";
import { UserRoles } from "src/common/enums/role.enum";

export class CreateUserDto {
    @ApiProperty({ example: "adam@user.com" })
    @IsEmail()
    email: string

    @ApiProperty({ example: "adam" })
    @IsString()
    name: string

    @ApiProperty({ example: "adam" })
    @IsString()
    fullname: string

    @ApiProperty({ example: UserRoles.USER })
    @IsEnum(UserRoles)
    role: UserRoles

    @ApiProperty({ example: "adam123" })
    @MinLength(6)
    @IsString()
    password: string
}