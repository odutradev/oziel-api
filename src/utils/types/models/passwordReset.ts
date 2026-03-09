import type { Types } from "mongoose";

export type PasswordResetModelType = {
    _id?: Types.ObjectId;
    userID: Types.ObjectId;
    email: string;
    code: string;
    expiresAt: Date;
    createdAt: Date;
    verified?: boolean;
    attempts?: number;
};