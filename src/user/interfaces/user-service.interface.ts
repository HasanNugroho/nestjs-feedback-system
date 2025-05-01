import { CreateUserDto } from "../dtos/create-user.dto";
import { ResponseUserDto } from "../dtos/response-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";

export interface IUserService {
    /**
     * @param id - The ID of the user to find
     * 
     * @returns The user with the given ID, or null if not found
     */
    findById(id: string): Promise<ResponseUserDto | null>;

    /**
     * @param email - The email of the user to find 
     * 
     * @returns The user with the given email, or null if not found
     */
    findByEmail(email: string): Promise<ResponseUserDto | null>;

    /**
     * @param user - The user to create
     * 
     * @returns The created user
     */
    create(param: CreateUserDto): Promise<ResponseUserDto>;

    /**
     * @param id - identifier of the user to update
     * @param user - The user to update
     * 
     * @returns The updated user
     */
    update(id: string, param: UpdateUserDto): Promise<void>;

    /**
     * @param id - identifier of the user to update
     * @param user - The user to update
     * 
     * @returns The updated user
     */
    delete(id: string): Promise<void>;
}