import type { Types } from "mongoose";

export type VaultTransactionModelType = {
    _id?: Types.ObjectId;
    vaultID: Types.ObjectId;
    amount: number;
    type: "DEPOSIT" | "WITHDRAWAL";
    description?: string;
    date: Date;
    createdAt?: Date;
    updatedAt?: Date;
};