import mongoose from "mongoose";

import dateService from "@utils/services/date.service";

const vaultSchema = new mongoose.Schema({
    name: { type: String, required: true },
    balance: { type: Number, default: 0 },
    goal: { type: Number },
    description: { type: String },
    createdAt: { type: Date, default: () => dateService.now() },
    updatedAt: { type: Date, default: () => dateService.now() }
});

vaultSchema.index({ name: 1 });

const vaultModel = mongoose.model("vault", vaultSchema);

export default vaultModel;