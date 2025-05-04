import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { IFeedbackRepository } from "../interfaces/feedback-repository.interface";
import { Feedback } from "../models/feedback.model";
import { Between, FindOptionsWhere, ILike, Raw, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { FilterOptionDto } from "../dtos/filter-option.dto";

@Injectable()
export class FeedbackPGRepository implements IFeedbackRepository {
    constructor(
        @InjectRepository(Feedback)
        private readonly db: Repository<Feedback>,
    ) { }

    async create(feedback: Feedback): Promise<Feedback> {
        try {
            return await this.db.save(feedback);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async findAll(query: FilterOptionDto): Promise<{ feedback: Feedback[]; totalCount: number; }> {
        try {
            const where: FindOptionsWhere<Feedback> = {};

            where.message = query.keyword ? ILike(`%${query.keyword}%`) : undefined
            where.category = query?.category
            where.status = query?.status

            if (query.start_date && query.end_date) {
                where.createdAt = Between(new Date(query.start_date), new Date(query.end_date));
            } else if (query.start_date) {
                where.createdAt = Raw((alias) => `${alias} >= :date`, { date: query.start_date })
            } else if (query.end_date) {
                where.createdAt = Raw((alias) => `${alias} <= :date`, { date: query.end_date })
            }

            const [feedback, totalCount] = await this.db.findAndCount({
                where,
                order: {
                    [query.orderby || 'createdAt']: query.order || 'DESC',
                },
                skip: query.getOffset(),
                take: query.limit,
            });

            return { feedback, totalCount };
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    async findById(id: string): Promise<Feedback | null> {
        return await this.db.findOneBy({ id });
    }

    async update(id: string, feedback: Partial<Feedback>): Promise<void> {
        try {
            const { attachment, ...safeUpdate } = feedback;

            await this.db.update(id, { ...safeUpdate, updatedAt: new Date() });
        } catch (error) {
            throw new InternalServerErrorException(error?.message || 'Update failed');
        }
    }

}