import type { Types } from "mongoose"

export type MeetingMinuteHistoryType = {
    content: string
    updatedBy: Types.ObjectId
    updatedAt: Date
}

export type MeetingMinuteModelType = {
    _id?: Types.ObjectId
    title: string
    date: Date
    history: MeetingMinuteHistoryType[]
    createdAt?: Date
    updatedAt?: Date
}