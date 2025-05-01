import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { UserRole } from "src/common/enums/role.enum";

export class UpdateUserDto {
    @ApiProperty({
        description: "email of user",
        example: "adam@user.com"
    })
    @IsEmail()
    @IsOptional()
    email?: string

    @ApiProperty({
        description: "Name of user",
        example: "adam"
    })
    @IsString()
    @IsOptional()
    name?: string

    @ApiProperty({
        description: "Full name of user",
        example: "adam"
    })
    @IsString()
    @IsOptional()
    fullname?: string

    @ApiProperty({
        description: "role of user",
        enum: UserRole,
        example: UserRole.USER
    })
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole

    @ApiProperty({
        description: "password",
        example: "adam123"
    })
    @MinLength(6)
    @IsOptional()
    @IsString()
    password?: string
}