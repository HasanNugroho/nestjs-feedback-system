import { User } from "../models/user.model";

export interface IUserRepository {
    /**
     * @param id - The ID of the user to find
     * 
     * @returns The user with the given ID, or null if not found
     */
    findById(id: string): Promise<User | null>;

    /**
     * @param email - The email of the user to find 
     * 
     * @returns The user with the given email, or null if not found
     */
    findByEmail(email: string): Promise<User | null>;

    /**
     * 
     * @returns The users with minimal data
     */
    getAllUsersMinimalData(): Promise<User[]>;

    /**
     * @param user - The user to create
     * 
     * @returns The created user
     */
    create(user: User): Promise<User>;

    /**
     * @param id - identifier of the user to update
     * @param user - The user to update
     * 
     * @returns The updated user
     */
    update(id: string, user: User): Promise<void>;

    /**
     * @param id - identifier of the user to update
     * @param user - The user to update
     * 
     * @returns The updated user
     */
    delete(id: string): Promise<void>;
}   