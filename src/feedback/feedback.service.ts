import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IFeedbackService } from './interfaces/feedback-service.interface';
import { FEEDBACK_REPOSITORY_PG } from 'src/common/constant';
import { IFeedbackRepository } from './interfaces/feedback-repository.interface';
import { CreateFeedbackDto } from './dtos/create-feedback.dto';
import { Feedback } from './models/feedback.model';
import { UpdateStatusFeedbackDto } from './dtos/update-feedback.dto';
import { FeedbackStatus } from 'src/common/enums/feedback.enum';
import { FilterOptionDto } from './dtos/filter-option.dto';

@Injectable()
export class FeedbackService implements IFeedbackService {
    constructor(
        @Inject(FEEDBACK_REPOSITORY_PG)
        private feedbackRepository: IFeedbackRepository,
    ) { }

    async create(userID: string, param: CreateFeedbackDto, files?: Express.Multer.File[],): Promise<Feedback> {
        try {
            const feedback = new Feedback();
            feedback.category = param.category
            feedback.message = param.message
            feedback.status = FeedbackStatus.PENDING
            feedback.userId = userID

            const result = await this.feedbackRepository.create(feedback)

            return result

        } catch (error) {
            throw error
        }
    }

    async findAll(query: FilterOptionDto): Promise<{ feedback: Feedback[]; totalCount: number; }> {
        try {
            return await this.feedbackRepository.findAll(query);
        } catch (error) {
            throw error
        }
    }

    async findById(id: string): Promise<Feedback | null> {
        try {
            const date = new Date();
            console.log(date)
            return await this.feedbackRepository.findById(id);
        } catch (error) {
            throw error
        }
    }

    async updateStatus(id: string, param: UpdateStatusFeedbackDto): Promise<void> {
        try {
            const feedback = await this.feedbackRepository.findById(id);
            if (!feedback) {
                throw new NotFoundException("record not found")
            }

            feedback.status = param.status

            await this.feedbackRepository.update(id, feedback)
        } catch (error) {
            throw error
        }
    }
}
