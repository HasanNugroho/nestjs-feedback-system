import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IFeedbackService } from './interfaces/feedback-service.interface';
import { FEEDBACK_ATTACHMENT_REPOSITORY, FEEDBACK_REPOSITORY } from 'src/common/constant';
import { IFeedbackRepository } from './interfaces/feedback-repository.interface';
import { CreateFeedbackDto } from './dtos/create-feedback.dto';
import { Feedback } from './models/feedback.model';
import { UpdateStatusFeedbackDto } from './dtos/update-feedback.dto';
import { FeedbackStatus } from 'src/common/enums/feedback.enum';
import { FilterOptionDto } from './dtos/filter-option.dto';
import { IFeedbackAttachmentRepository } from './interfaces/feedback-attachment-repository.interface';
import { ExternalUserServiceAdapter } from './adapters/external-user-service.adapter';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FeedbackCreatedEvent } from './events/feedback-create.event';
import { EventName } from '../common/enums/event-name.enum';
import { IUser } from 'src/common/interfaces/user.interface';
import { FeedbackReminderEvent } from './events/feedback-reminder.event';

@Injectable()
export class FeedbackService implements IFeedbackService {
    private readonly logger = new Logger(FeedbackService.name);

    constructor(
        @Inject(FEEDBACK_REPOSITORY)
        private feedbackRepository: IFeedbackRepository,

        @Inject(FEEDBACK_ATTACHMENT_REPOSITORY)
        private feedbackAttachmentRepo: IFeedbackAttachmentRepository,

        private userServiceAdapter: ExternalUserServiceAdapter,
        private eventEmitter: EventEmitter2
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

            // Emit the feedback created event
            this.eventEmitter.emit(EventName.FEEDBACK_CREATED, new FeedbackCreatedEvent(result, userID));

            return result
        } catch (err) {
            this.logger.error(err)
            throw err
        }
    }

    async findAll(query: FilterOptionDto): Promise<{ feedback: Feedback[]; totalCount: number; }> {
        try {
            return await this.feedbackRepository.findAll(query);
        } catch (err) {
            this.logger.error(err)
            throw err
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
        } catch (err) {
            this.logger.error(err)
            throw err
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
        } catch (err) {
            this.logger.error(err)
            throw err
        }
    }

    async reminderUser(days: number = 7): Promise<IUser[]> {
        try {
            const users = await this.findUsersDueForFeedbackReminder(days)

            // Emit the feedback reminder event
            this.eventEmitter.emit(EventName.FEEDBACK_REMINDER, new FeedbackReminderEvent(users));

            return users;
        } catch (err) {
            this.logger.error(err)
            throw err
        }
    }

    async findUsersDueForFeedbackReminder(days: number = 7): Promise<IUser[]> {
        try {
            const feedbacks = await this.feedbackRepository.findFeedbacksSubmittedRecently(days);

            const usersWithFeedbackIds = new Set(feedbacks.map(feedback => feedback.userId));

            const users = await this.userServiceAdapter.findAllUserMinimal();
            if (!users || users.length === 0) {
                throw new NotFoundException('No users found');
            }

            return users.filter(user => !usersWithFeedbackIds.has(user.id));
        } catch (err) {
            this.logger.error('Error finding users due for feedback reminder:', err);
            throw err
        }
    }
}
