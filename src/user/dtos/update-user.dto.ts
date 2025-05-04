import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { UserRoles } from "src/common/enums/role.enum";

export class UpdateUserDto {
    @ApiProperty({ example: "adam@user.com" })
    @IsEmail()
    @IsOptional()
    email?: string

    @ApiProperty({ example: "adam" })
    @IsString()
    @IsOptional()
    name?: string

    @ApiProperty({ example: "adam" })
    @IsString()
    @IsOptional()
    fullname?: string

    @ApiProperty({ example: UserRoles.USER })
    @IsEnum(UserRoles)
    @IsOptional()
    role?: UserRoles

    @ApiProperty({ example: "adam123" })
    @MinLength(6)
    @IsOptional()
    @IsString()
    password?: string
}