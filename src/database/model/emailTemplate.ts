import mongoose from "mongoose";

import dateService from "@utils/services/date.service";

const emailTemplateSchema = new mongoose.Schema({
    trigger: {
        type: String,
        required: true,
        unique: true,
        enum: [
            "PASSWORD_RESET",
            "PASSWORD_CHANGED"
        ]
    },
    subject: {
        type: String,
        required: true
    },
    markdownBody: {
        type: String,
        required: true
    },
    variables: {
        type: [String],
        default: []
    },
    description: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
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

emailTemplateSchema.index({ trigger: 1 });
emailTemplateSchema.index({ active: 1 });

const emailTemplateModel = mongoose.model("emailTemplate", emailTemplateSchema);

export default emailTemplateModel;