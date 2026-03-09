import mongoose from "mongoose";

import dateService from "@utils/services/date.service";

const logSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: [
            "user_created",
            "user_updated", 
            "user_deleted",
            "user_signin",
            "user_signup",
            "system_action"
        ]
    },
    entity: {
        type: String,
        required: true,
        enum: ["user", "system"]
    },
    entityID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    description: {
        type: String,
        required: true
    },
    payload: {
        type: mongoose.Schema.Types.Mixed
    },
    metadata: {
        ip: String,
        userAgent: String,
        location: String,
        additionalInfo: mongoose.Schema.Types.Mixed
    },
    timestamp: {
        type: Date,
        default: () => dateService.now(),
        required: true
    }
});

logSchema.index({ action: 1, timestamp: -1 });
logSchema.index({ entityID: 1, timestamp: -1 });
logSchema.index({ userID: 1, timestamp: -1 });

const logModel = mongoose.model("log", logSchema);

export default logModel;