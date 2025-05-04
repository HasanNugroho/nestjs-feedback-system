import { IUser } from "src/common/interfaces/user.interface";

export class FeedbackReminderEvent {
    constructor(
        public readonly users: IUser[],
    ) { }
}
