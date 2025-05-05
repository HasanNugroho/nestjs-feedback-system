import { FeedbackCategory, FeedbackStatus } from "src/common/enums/feedback.enum"
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { FeedbackAttachment } from "./feedback-attachment.schema"
import { IUser } from "src/common/interfaces/user.interface"

@Entity('feedbacks')
export class Feedback {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    message: string

    @Column({
        type: 'enum',
        enum: FeedbackCategory,
        default: FeedbackCategory.GENERAL_FEEDBACK,
    })
    category: FeedbackCategory

    @Column({
        type: 'enum',
        enum: FeedbackStatus,
        default: FeedbackStatus.PENDING,
    })
    status: FeedbackStatus

    @Column()
    userId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    attachment?: FeedbackAttachment[]
    user?: IUser
}
