import mongoose from "mongoose";

import { CONTRACT_STATUS_ARRAY, CONTRACT_TYPES_ARRAY, CONTRACT_STATUS } from "@utils/types/models/contract";
import dateService from "@utils/services/date.service";

const contractSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: CONTRACT_TYPES_ARRAY,
        required: true
    },
    status: {
        type: String,
        enum: CONTRACT_STATUS_ARRAY,
        default: CONTRACT_STATUS.ACTIVE
    },
    contractDate: {
        type: Date,
        required: true
    },
    deliveryForecast: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    totalValue: {
        type: Number,
        required: true
    },
    totalSalePrice: {
        type: Number,
        required: true
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

contractSchema.index({ code: 1 });
contractSchema.index({ status: 1 });
contractSchema.index({ type: 1 });
contractSchema.index({ contractDate: -1 });

const contractModel = mongoose.model("contract", contractSchema);

export default contractModel;