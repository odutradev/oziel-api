import type { Types } from "mongoose";

export type EmailTemplateModelType = {
    _id?: Types.ObjectId;
    trigger: "PASSWORD_RESET" | "PASSWORD_CHANGED";
    subject: string;
    markdownBody: string;
    variables: string[];
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    description?: string;
};