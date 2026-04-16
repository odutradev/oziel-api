import mongoose from "mongoose";

import dateService from "@utils/services/date.service";

const productionSchema = new mongoose.Schema({
    referenceYear: {
        type: Number,
        required: true
    },
    productionArea: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    plantingSeason: {
        type: String
    },
    harvestSeason: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
    producer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
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

productionSchema.index({ referenceYear: -1 });
productionSchema.index({ producer: 1 });
productionSchema.index({ product: 1 });
productionSchema.index({ active: 1 });

const productionModel = mongoose.model("production", productionSchema);

export default productionModel;