import { Injectable, NotFoundException } from "@nestjs/common";
import { IUser } from "src/common/interfaces/user.interface";
import { UserServiceAdapter } from "src/user/adapters/user-service.adapter";

@Injectable()
export class ExternalUserServiceAdapter {
    constructor(
        private readonly userServiceAdapter: UserServiceAdapter,
    ) { }

    async findUserByID(id: string): Promise<IUser | null> {
        try {
            const result = await this.userServiceAdapter.execute({
                type: 'FIND_BY_ID',
                payload: { id },
            });

            if (!result) {
                throw new NotFoundException();
            }

            const { password, ...safeUser }: IUser = result;
            return safeUser;
        } catch (error) {
            console.error(`Error fetching user ${id}:`, error);
            throw error
        }
    }

}