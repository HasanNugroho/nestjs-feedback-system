import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsString, MinLength } from "class-validator";
import { UserRoles } from "src/common/enums/role.enum";

export class CreateUserDto {
    @ApiProperty({
        description: "email of user",
        example: "adam@user.com"
    })
    @IsEmail()
    email: string

    @ApiProperty({
        description: "Name of user",
        example: "adam"
    })
    @IsString()
    name: string

    @ApiProperty({
        description: "Full name of user",
        example: "adam"
    })
    @IsString()
    fullname: string

    @ApiProperty({
        description: "Role of user",
        enum: UserRoles,
        example: UserRoles.USER
    })
    @IsEnum(UserRoles)
    role: UserRoles

    @ApiProperty({
        description: "password",
        example: "adam123"
    })
    @MinLength(6)
    @IsString()
    password: string
}