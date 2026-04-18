import mongoose from "mongoose"

import { MARKETING_REQUEST_STATUS_ARRAY, MARKETING_REQUEST_STATUS } from "@utils/types/models/marketingRequest"
import dateService from "@utils/services/date.service"

const marketingRequestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    status: {
        type: String,
        enum: MARKETING_REQUEST_STATUS_ARRAY,
        default: MARKETING_REQUEST_STATUS.DRAFT
    },
    plannedDate: {
        type: Date
    },
    strategy: {
        type: String
    },
    content: {
        type: String
    },
    feedbackNotes: {
        type: String
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    results: {
        type: String
    },
    createdAt: {
        type: Date,
        default: () => dateService.now()
    },
    updatedAt: {
        type: Date,
        default: () => dateService.now()
    }
})

marketingRequestSchema.index({ requester: 1 })
marketingRequestSchema.index({ status: 1 })
marketingRequestSchema.index({ plannedDate: 1 })
marketingRequestSchema.index({ createdAt: -1 })

const marketingRequestModel = mongoose.model("marketingRequest", marketingRequestSchema)

export default marketingRequestModel