import { PaginationOptionsDto } from "src/common/dtos/page-option.dto";
import { Feedback } from "../models/feedback.model";
import { FilterOptionDto } from "../dtos/filter-feedback.dto";

export interface IFeedbackRepository {
    /**
     * @param id - The ID of the feedback to find
     * 
     * @returns An object containing a list of feedbacks and the total count
     */
    findById(id: string): Promise<Feedback | null>;

    /**
     * @param FilterOptionDto - Options for pagination, including page number and size
     * 
     * @returns The feedback with the given ID, or null if not found
     */
    findAll(query: FilterOptionDto): Promise<{ feedback: Feedback[], totalCount: number }>;

    /**
     * Finds feedbacks submitted within the last specified number of days.
     *
     * @param days - The number of days to consider feedbacks as recent.
     * @returns An array of feedbacks submitted within the last specified number of days.
     */
    findFeedbacksSubmittedRecently(days: number): Promise<Feedback[]>

    /**
     * @param feedback - The feedback to create
     * 
     * @returns The created feedback
     */
    create(feedback: Feedback): Promise<Feedback>;

    /**
     * @param id - identifier of the feedback to update
     * @param feedback - The feedback to update
     * 
     * @returns The updated feedback
     */
    update(id: string, feedback: Feedback): Promise<void>;
}   