import type { Types } from "mongoose";

export type TransactionModelType = {
    _id?: Types.ObjectId;
    userID: Types.ObjectId;
    description: string;
    isCarryOver: boolean;
    type: "INCOME" | "EXPENSE";
    referenceDate: Date;
    updatedAt: Date;
    createdAt: Date;
    amount: number;
};