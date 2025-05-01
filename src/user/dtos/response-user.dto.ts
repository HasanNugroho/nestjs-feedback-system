import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/common/enums/role.enum';

export class ResponseUserDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID unik pengguna' })
    id: string;

    @ApiProperty({ example: 'johndoe', description: 'Nama pengguna' })
    name: string;

    @ApiProperty({ example: 'John Doe', description: 'Nama lengkap pengguna' })
    fullname: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'Alamat email pengguna' })
    email: string;

    @ApiProperty({ enum: UserRole, example: UserRole.ADMIN, description: 'Peran pengguna' })
    role: UserRole;

    @ApiProperty({ example: '2025-05-01T12:00:00Z', description: 'Tanggal pembuatan' })
    createdAt: Date;

    @ApiProperty({ example: '2025-05-01T12:00:00Z', description: 'Tanggal pembaruan terakhir' })
    updatedAt: Date;
}
