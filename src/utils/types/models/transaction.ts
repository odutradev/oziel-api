import type { Types } from "mongoose";

export const TRANSACTION_TYPES = {
    INCOME: "INCOME",
    EXPENSE: "EXPENSE"
} as const;

export const TRANSACTION_STATUS = {
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED"
} as const;

export type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];
export type TransactionStatusType = typeof TRANSACTION_STATUS[keyof typeof TRANSACTION_STATUS];

export const TRANSACTION_TYPES_ARRAY = Object.values(TRANSACTION_TYPES);
export const TRANSACTION_STATUS_ARRAY = Object.values(TRANSACTION_STATUS);

export type TransactionModelType = {
    _id?: Types.ObjectId;
    title: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatusType;
    date: Date;
    description?: string;
    category?: string;
    createdAt?: Date;
    updatedAt?: Date;
};