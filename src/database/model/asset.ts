import mongoose from "mongoose";

import dateService from "@utils/services/date.service";

const assetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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

assetSchema.index({ name: 1 });
assetSchema.index({ active: 1 });

const assetModel = mongoose.model("asset", assetSchema);

export default assetModel;