import mongoose from "mongoose";

import dateService from "@utils/services/date.service";

const transactionSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    type: {
        enum: ["INCOME", "EXPENSE"],
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    amount: {
        required: true,
        type: Number
    },
    referenceDate: {
        default: () => dateService.now(),
        required: true,
        type: Date
    },
    isCarryOver: {
        default: false,
        type: Boolean
    },
    createdAt: {
        default: () => dateService.now(),
        type: Date
    },
    updatedAt: {
        default: () => dateService.now(),
        type: Date
    }
});

transactionSchema.index({ type: 1, referenceDate: -1 });
transactionSchema.index({ referenceDate: -1, userID: 1 });

const transactionModel = mongoose.model("transaction", transactionSchema);

export default transactionModel;