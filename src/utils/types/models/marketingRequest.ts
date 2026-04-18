import type { Types } from "mongoose"

export const MARKETING_REQUEST_STATUS = {
    REVISION_REQUIRED: "REVISION_REQUIRED",
    WAITING_APPROVAL: "WAITING_APPROVAL",
    COMPLETED: "COMPLETED",
    APPROVED: "APPROVED",
    PLANNED: "PLANNED",
    DRAFT: "DRAFT"
} as const

export type MarketingRequestStatusType = typeof MARKETING_REQUEST_STATUS[keyof typeof MARKETING_REQUEST_STATUS]

export const MARKETING_REQUEST_STATUS_ARRAY = Object.values(MARKETING_REQUEST_STATUS)

export type MarketingRequestModelType = {
    _id?: Types.ObjectId
    title: string
    description: string
    requester: Types.ObjectId
    status: MarketingRequestStatusType
    plannedDate?: Date
    strategy?: string
    content?: string
    feedbackNotes?: string
    approvedBy?: Types.ObjectId
    results?: string
    createdAt?: Date
    updatedAt?: Date
}