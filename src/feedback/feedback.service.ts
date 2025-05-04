import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IFeedbackService } from './interfaces/feedback-service.interface';
import { FEEDBACK_ATTACHMENT_REPOSITORY, FEEDBACK_REPOSITORY } from 'src/common/constant';
import { IFeedbackRepository } from './interfaces/feedback-repository.interface';
import { CreateFeedbackDto } from './dtos/create-feedback.dto';
import { Feedback } from './models/feedback.model';
import { UpdateStatusFeedbackDto } from './dtos/update-feedback.dto';
import { FeedbackStatus } from 'src/common/enums/feedback.enum';
import { FilterOptionDto } from './dtos/filter-option.dto';
import { IFeedbackAttachmentRepository } from './interfaces/feedback-attachment-repository.interface';
import { ConfigService } from '@nestjs/config';
import { ExternalUserServiceAdapter } from './adapters/external-user-service.adapter';

@Injectable()
export class FeedbackService implements IFeedbackService {
    constructor(
        @Inject(FEEDBACK_REPOSITORY)
        private feedbackRepository: IFeedbackRepository,

        @Inject(FEEDBACK_ATTACHMENT_REPOSITORY)
        private feedbackAttachmentRepo: IFeedbackAttachmentRepository,

        private userServiceAdapter: ExternalUserServiceAdapter,
    ) { }

    async create(userID: string, param: CreateFeedbackDto, files?: Express.Multer.File[]): Promise<Feedback> {
        try {
            const feedback = new Feedback();
            feedback.category = param.category
            feedback.message = param.message
            feedback.status = FeedbackStatus.PENDING
            feedback.userId = userID

            const result = await this.feedbackRepository.create(feedback)

            if (result && files && files.length > 0) {
                const attachments = files.map(file => {
                    return {
                        feedbackId: result.id,
                        fileName: file.originalname,
                        mimetype: file.mimetype,
                        path: `/data/${file.originalname}`,
                        size: file.size.toString()
                    };
                });

                await this.feedbackAttachmentRepo.saveAttachments(attachments);
            }

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
            const feedback = await this.feedbackRepository.findById(id);
            if (!feedback) {
                throw new NotFoundException('record not found')
            }

            const attachment = await this.feedbackAttachmentRepo.findByFeedbackId(id);
            if (attachment) {
                feedback.attachment = attachment
            }

            const user = await this.userServiceAdapter.findUserByID(feedback.userId)
            if (user) {
                feedback.user = user
            }

            return feedback
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
