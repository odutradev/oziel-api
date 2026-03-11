import type { Types } from "mongoose";

export type VaultModelType = {
    _id?: Types.ObjectId;
    name: string;
    balance: number;
    goal?: number;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
};