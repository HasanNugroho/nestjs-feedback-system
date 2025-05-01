import { UserRole } from "../enums/role.enum";

export interface IUser {
    id: string;
    name: string;
    fullname: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}