import mongoose from "mongoose";

import { TRANSACTION_STATUS_ARRAY, TRANSACTION_TYPES_ARRAY, TRANSACTION_STATUS } from "@utils/constants/treasury";
import dateService from "@utils/services/date.service";

const transactionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: TRANSACTION_TYPES_ARRAY, required: true },
    status: { type: String, enum: TRANSACTION_STATUS_ARRAY, default: TRANSACTION_STATUS.PENDING },
    date: { type: Date, required: true },
    description: String,
    category: String,
    createdAt: { type: Date, default: () => dateService.now() },
    updatedAt: { type: Date, default: () => dateService.now() }
});

transactionSchema.index({ date: -1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ type: 1 });

const transactionModel = mongoose.model("transaction", transactionSchema);

export default transactionModel;