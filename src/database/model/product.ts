import mongoose from "mongoose";

import dateService from "@utils/services/date.service";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        default: "kg"
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

productSchema.index({ name: 1 });
productSchema.index({ active: 1 });

const productModel = mongoose.model("product", productSchema);

export default productModel;