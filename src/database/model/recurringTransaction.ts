import mongoose from "mongoose";

import { TRANSACTION_TYPES_ARRAY, RECURRING_FREQUENCIES_ARRAY } from "@utils/constants/treasury";
import dateService from "@utils/services/date.service";

const recurringTransactionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: TRANSACTION_TYPES_ARRAY, required: true },
    frequency: { type: String, enum: RECURRING_FREQUENCIES_ARRAY, required: true },
    dayOfMonth: { type: Number, min: 1, max: 31 },
    intervalDays: { type: Number, min: 1 },
    nextExecution: { type: Date, required: true },
    active: { type: Boolean, default: true },
    description: String,
    category: String,
    createdAt: { type: Date, default: () => dateService.now() },
    updatedAt: { type: Date, default: () => dateService.now() }
});

recurringTransactionSchema.index({ nextExecution: 1, active: 1 });
recurringTransactionSchema.index({ type: 1 });

const recurringTransactionModel = mongoose.model("recurringTransaction", recurringTransactionSchema);

export default recurringTransactionModel;