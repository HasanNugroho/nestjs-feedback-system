import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../models/user.model";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @InjectRepository(User)
        private readonly db: Repository<User>,
    ) { }

    async create(user: User): Promise<User> {
        try {
            return this.db.save(user);
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Role already exists');
            }
            throw new InternalServerErrorException(error);
        }
    }

    async findById(id: string): Promise<User | null> {
        return this.db.findOne({ where: { id } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.db.findOne({ where: { email } });
    }

    async update(id: string, userData: Partial<User>): Promise<void> {
        try {
            const result = await this.db.update(id, userData);

            if (result.affected === 0) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.db.delete(id);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
