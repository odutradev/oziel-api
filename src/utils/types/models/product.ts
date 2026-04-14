import type { Types } from "mongoose";

export type ProductModelType = {
    _id?: Types.ObjectId;
    name: string;
    unit: string;
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};