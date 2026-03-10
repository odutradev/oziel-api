import type { Types } from "mongoose";

export type TransactionModelType = {
    _id?: Types.ObjectId;
    title: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    status: "PENDING" | "CONFIRMED";
    date: Date;
    description?: string;
    category?: string;
    createdAt?: Date;
    updatedAt?: Date;
};