import { UserRole } from "src/common/enums/role.enum";
import { IUser } from "src/common/interfaces/user.interface";
import bcrypt from "bcryptjs";
import { ResponseUserDto } from "../dtos/response-user.dto";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User implements IUser {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    fullname: string;

    @Column({ unique: true })
    email: string;

    @Column()
    role: UserRole;

    @Column()
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
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