import { Mocked, TestBed } from "@suites/unit";
import { FeedbackService } from "./feedback.service";
import { IFeedbackRepository } from "./interfaces/feedback-repository.interface";
import { IFeedbackAttachmentRepository } from "./interfaces/feedback-attachment-repository.interface";
import { ExternalUserServiceAdapter } from "./adapters/external-user-service.adapter";
import { FEEDBACK_ATTACHMENT_REPOSITORY, FEEDBACK_REPOSITORY } from "src/common/constant";
import { CreateFeedbackDto } from "./dtos/create-feedback.dto";
import { FeedbackCategory, FeedbackStatus } from "src/common/enums/feedback.enum";
import { Readable } from "stream";
import { Feedback } from "./models/feedback.model";
import { FilterOptionDto } from "./dtos/filter-option.dto";
import { FeedbackAttachment } from "./models/feedback-attachment.model";
import { UserRoles } from "src/common/enums/role.enum";
import { User } from "src/user/models/user.model";
import { NotFoundException } from "@nestjs/common";
import { UpdateStatusFeedbackDto } from "./dtos/update-feedback.dto";

describe('UserService', () => {
    let service: FeedbackService;
    let repository: Mocked<IFeedbackRepository>;
    let repositoryAttachment: Mocked<IFeedbackAttachmentRepository>;
    let userServiceAdapter: Mocked<ExternalUserServiceAdapter>;

    beforeEach(async () => {
        const { unit, unitRef } = await TestBed.solitary(FeedbackService).compile();

        service = unit;
        repository = unitRef.get(FEEDBACK_REPOSITORY);
        repositoryAttachment = unitRef.get(FEEDBACK_ATTACHMENT_REPOSITORY)
        userServiceAdapter = unitRef.get(ExternalUserServiceAdapter)
    });

    describe('create', () => {
        const userId = 'user-123';
        const mockFiles: Express.Multer.File[] = [
            {
                originalname: 'screenshot.png',
                mimetype: 'image/png',
                buffer: Buffer.from('fake image'),
                size: 1024,
                fieldname: '',
                encoding: '',
                destination: '',
                filename: '',
                path: '',
                stream: Readable.from([]),
            },
        ];

        const dto: CreateFeedbackDto = {
            category: FeedbackCategory.BUG_REPORT,
            message: "test",
            files: mockFiles
        }

        it('should create feedback without files', async () => {
            const feedback = { ...dto, id: 'feedback-1', status: FeedbackStatus.PENDING, userId, createdAt: new Date(), updatedAt: new Date() };
            repository.create.mockResolvedValue(feedback);

            const result = await service.create(userId, dto);

            expect(result).toEqual(feedback);
            expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({
                category: dto.category,
                message: dto.message,
                status: FeedbackStatus.PENDING,
                userId,
            }));
            expect(repositoryAttachment.saveAttachments).not.toHaveBeenCalled();
        })

        it('should create feedback with files and save attachments', async () => {
            const feedback = { id: 'feedback-2', ...dto, status: FeedbackStatus.PENDING, userId, createdAt: new Date(), updatedAt: new Date() };
            repository.create.mockResolvedValue(feedback);
            repositoryAttachment.saveAttachments.mockResolvedValue(undefined);

            const result = await service.create(userId, dto, mockFiles);

            expect(result).toEqual(feedback);
            expect(repositoryAttachment.saveAttachments).toHaveBeenCalledWith([
                expect.objectContaining({
                    feedbackId: 'feedback-2',
                    fileName: 'screenshot.png',
                    path: '/data/screenshot.png',
                }),
            ]);
        });

        it('should throw error if repository fails', async () => {
            repository.create.mockRejectedValue(new Error('DB error'));

            await expect(service.create(userId, dto)).rejects.toThrow('DB error');
        });
    })

    describe('findAll', () => {
        it('should return feedbacks', async () => {
            const mockFeedbacks: Feedback[] = [
                {
                    userId: "user-id",
                    category: FeedbackCategory.BUG_REPORT,
                    message: "message",
                    id: "id",
                    status: FeedbackStatus.PENDING,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            ]
            const mockOption: FilterOptionDto = {
                limit: 10,
                page: 1,
                getOffset: jest.fn(),
            }

            repository.findAll.mockResolvedValue({ feedback: mockFeedbacks, totalCount: mockFeedbacks.length });

            const result = await service.findAll(mockOption);

            expect(result.totalCount).toEqual(mockFeedbacks.length);
            expect(result.feedback).toEqual(mockFeedbacks);
        })
    })

    describe('findById', () => {
        const mockFeedbacks: Feedback = {
            userId: "user-id",
            category: FeedbackCategory.BUG_REPORT,
            message: "message",
            id: "feedback-id",
            status: FeedbackStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        const mockFeedbackAttachment: FeedbackAttachment[] = [
            {
                _id: 'attachment-1',
                feedbackId: 'feedback-123',
                fileName: 'image.png',
                mimetype: 'image/png',
                path: '/data/image.png',
                size: '1024',
            } as FeedbackAttachment,
        ]

        const mockUser = new User();
        mockUser.email = "exist@example.com";
        mockUser.name = "Existing User";
        mockUser.fullname = "Existing Full User";
        mockUser.role = UserRoles.USER;
        mockUser.id = 'user-id';

        it('should return feedback', async () => {
            repository.findById.mockResolvedValue(mockFeedbacks);
            repositoryAttachment.findByFeedbackId.mockResolvedValueOnce(mockFeedbackAttachment)
            userServiceAdapter.findUserByID.mockResolvedValueOnce(mockUser)

            const result = await service.findById("feedback-id");

            expect(result?.id).toEqual(mockFeedbacks.id);
            await expect(repositoryAttachment.findByFeedbackId(mockFeedbacks.id)).not.toBeNull()
            await expect(userServiceAdapter.findUserByID(mockFeedbacks.userId))
        })

        it('should return feedback when attachment []', async () => {
            repository.findById.mockResolvedValue(mockFeedbacks);
            repositoryAttachment.findByFeedbackId.mockResolvedValueOnce([])

            const result = await service.findById("feedback-id");

            expect(result?.id).toEqual(mockFeedbacks.id);
            expect(repositoryAttachment.findByFeedbackId).toHaveBeenCalledWith(mockFeedbacks.id);
        })

        it('should return NotFoundException when user undefined', async () => {
            userServiceAdapter.findUserByID.mockResolvedValueOnce(null)

            await expect(service.findById("feedback-id")).rejects.toThrow(NotFoundException);
        })

        it('should NotFoundException when fetched failed ', async () => {
            repository.findById.mockResolvedValue(null);

            await expect(service.findById("feedback-id")).rejects.toThrow(NotFoundException);
        })
    })

    describe('updateStatus', () => {
        const mockFeedbacks: Feedback = {
            userId: "user-id",
            category: FeedbackCategory.BUG_REPORT,
            message: "message",
            id: "feedback-id",
            status: FeedbackStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        const updateDto: UpdateStatusFeedbackDto = {
            status: FeedbackStatus.RESOLVED
        }

        it('should update feedback', async () => {
            repository.findById.mockResolvedValue(mockFeedbacks);
            repository.update.mockResolvedValue(undefined)

            const result = await service.updateStatus(mockFeedbacks.id, updateDto);

            expect(result).toBe(undefined);
        })

        it('should return NotFoundException', async () => {
            repository.findById.mockResolvedValue(null);
            repository.update.mockResolvedValue(undefined)

            await expect(service.updateStatus(mockFeedbacks.id, updateDto)).rejects.toThrow(NotFoundException);
        })
    })
})