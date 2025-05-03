import { Injectable } from "@nestjs/common";
import { UserServiceAdapter } from "src/user/adapters/user-service.adapter";
import { User } from "src/user/models/user.model";

@Injectable()
export class ExternalUserServiceAdapter {
    constructor(
        private readonly userServiceAdapter: UserServiceAdapter,
    ) { }

    async findUserByEmail(email: string): Promise<User | null> {
        try {
            const result = await this.userServiceAdapter.execute({
                type: 'FIND_BY_EMAIL',
                payload: { email: email },
            });

            return result as User | null;
        } catch (error) {
            console.error(`Error fetching user ${email}:`, error);
            throw error
        }
    }

    async findUserByID(id: string): Promise<User | null> {
        try {
            const result = await this.userServiceAdapter.execute({
                type: 'FIND_BY_ID',
                payload: { id },
            });

            return result as User | null;
        } catch (error) {
            console.error(`Error fetching user ${id}:`, error);
            throw error
        }
    }

}