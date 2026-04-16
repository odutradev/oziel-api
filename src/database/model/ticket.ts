import mongoose from "mongoose";

import { TICKET_STATUS_ARRAY, TICKET_PRIORITY_ARRAY, TICKET_STATUS, TICKET_PRIORITY } from "@utils/types/models/ticket";
import dateService from "@utils/services/date.service";

const ticketSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: TICKET_STATUS_ARRAY,
        default: TICKET_STATUS.OPEN
    },
    priority: {
        type: String,
        enum: TICKET_PRIORITY_ARRAY,
        default: TICKET_PRIORITY.LOW
    },
    resolutionNotes: {
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
});

ticketSchema.index({ requester: 1 });
ticketSchema.index({ assignedTo: 1 });
ticketSchema.index({ status: 1 });
ticketSchema.index({ createdAt: -1 });

const ticketModel = mongoose.model("ticket", ticketSchema);

export default ticketModel;