import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from 'src/common/enums/role.enum';

export class ResponseUserDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    id: string;

    @ApiProperty({ example: 'johndoe' })
    name: string;

    @ApiProperty({ example: 'John Doe' })
    fullname: string;

    @ApiProperty({ example: 'john.doe@example.com' })
    email: string;

    @ApiProperty({ example: UserRoles.ADMIN })
    role: UserRoles;

    @ApiProperty({ example: '2025-05-01T12:00:00Z' })
    createdAt: Date;

    @ApiProperty({ example: '2025-05-01T12:00:00Z' })
    updatedAt: Date;
}
