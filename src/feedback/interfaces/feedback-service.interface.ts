import { CreateFeedbackDto } from "../dtos/create-feedback.dto";
import { UpdateStatusFeedbackDto } from "../dtos/update-feedback.dto";
import { Feedback } from "../models/feedback.model";
import { FilterOptionDto } from "../dtos/filter-option.dto";

export interface IFeedbackService {
    /**
     * @param id - The ID of the feedback to find
     * 
     * @returns A list of feedback and the total count of feedback items
     */
    findById(id: string): Promise<Feedback | null>;

    /**
     * @param FilterOptionDto - Options for pagination, including page number and size
     * 
     * @returns The feedback with the given ID, or null if not found
     */
    findAll(query: FilterOptionDto): Promise<{ feedback: Feedback[], totalCount: number }>;

    /**
     * @param feedback - The feedback to create
     * 
     * @returns The created feedback
     */
    create(userID: string, param: CreateFeedbackDto, file?: Express.Multer.File[]): Promise<Feedback>;

    /**
     * @param id - identifier of the feedback to update
     * @param feedback - The feedback to update
     * 
     * @returns The updated feedback
     */
    updateStatus(id: string, param: UpdateStatusFeedbackDto): Promise<void>;
}