import { UserRoles } from "../enums/role.enum";

export interface IUser {
    id: string;
    name: string;
    fullname: string;
    email: string;
    role: UserRoles;
    createdAt: Date;
    updatedAt: Date;

    password?: string;
}