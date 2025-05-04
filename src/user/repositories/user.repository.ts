import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../models/user.model";
import { FindOptionsWhere, ILike, Repository } from "typeorm";
import { PaginationOptionsDto } from "src/common/dtos/page-option.dto";

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
                throw new ConflictException('user already exists');
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

    async findAll(query: PaginationOptionsDto): Promise<{ users: User[]; totalCount: number; }> {
        try {
            const where: FindOptionsWhere<User> = {};

            where.name = query.keyword ? ILike(`%${query.keyword}%`) : undefined
            where.email = query.keyword ? ILike(`%${query.keyword}%`) : undefined
            where.fullname = query.keyword ? ILike(`%${query.keyword}%`) : undefined

            const [users, totalCount] = await this.db.findAndCount({
                where,
                order: {
                    [query.orderby || 'createdAt']: query.order || 'DESC',
                },
                skip: query.getOffset(),
                take: query.limit,
            });

            return { users, totalCount };
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    async getAllUsersMinimalData(): Promise<User[]> {
        return await this.db.find({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            }
        })
    }

    async update(id: string, userData: Partial<User>): Promise<void> {
        try {
            await this.db.update(id, { ...userData, updatedAt: new Date() });
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
