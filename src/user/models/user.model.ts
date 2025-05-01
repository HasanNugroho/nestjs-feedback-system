import { UserRole } from "src/common/enums/role.enum";
import { IUser } from "src/common/interfaces/user.interface";
import bcrypt from "bcryptjs";
import { ResponseUserDto } from "../dtos/response-user.dto";

export class User implements IUser {
    id: string;
    name: string;
    fullname: string;
    email: string;
    role: UserRole;
    password: string;
    createdAt: Date;
    updatedAt: Date;

    async encryptPassword(password: string): Promise<void> {
        const saltOrRounds = 10;
        this.password = await bcrypt.hash(password, saltOrRounds);
    }

    async validatePasswordHash(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }

    toResponse(): ResponseUserDto {
        return {
            id: this.id,
            name: this.name,
            fullname: this.fullname,
            email: this.email,
            role: this.role,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }

}