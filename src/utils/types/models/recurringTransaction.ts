import type { Types } from "mongoose";

export type RecurringTransactionModelType = {
    _id?: Types.ObjectId;
    title: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | "CUSTOM_DAYS";
    dayOfMonth?: number;
    intervalDays?: number;
    nextExecution: Date;
    active: boolean;
    description?: string;
    category?: string;
    createdAt?: Date;
    updatedAt?: Date;
};