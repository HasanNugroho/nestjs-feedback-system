import { CreateFeedbackDto } from "../dtos/create-feedback.dto";
import { UpdateFeedbackDto } from "../dtos/update-feedback.dto";
import { Feedback } from "../models/feedback.model";

export interface IFeedbackService {
    /**
     * @param id - The ID of the feedback to find
     * 
     * @returns The feedback with the given ID, or null if not found
     */
    findById(id: string): Promise<Feedback | null>;

    /**
     * @param feedback - The feedback to create
     * 
     * @returns The created feedback
     */
    create(param: CreateFeedbackDto): Promise<Feedback>;

    /**
     * @param id - identifier of the feedback to update
     * @param feedback - The feedback to update
     * 
     * @returns The updated feedback
     */
    update(id: string, param: UpdateFeedbackDto): Promise<void>;
}