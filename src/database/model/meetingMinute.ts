import mongoose from "mongoose"

import dateService from "@utils/services/date.service"

const meetingMinuteHistorySchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    updatedAt: {
        type: Date,
        default: () => dateService.now()
    }
}, { _id: false })

const meetingMinuteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    history: [meetingMinuteHistorySchema],
    createdAt: {
        type: Date,
        default: () => dateService.now()
    },
    updatedAt: {
        type: Date,
        default: () => dateService.now()
    }
})

meetingMinuteSchema.index({ date: -1 })
meetingMinuteSchema.index({ title: "text" })

const meetingMinuteModel = mongoose.model("meetingMinute", meetingMinuteSchema)

export default meetingMinuteModel