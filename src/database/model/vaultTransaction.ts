import mongoose from "mongoose";

import { VAULT_TRANSACTION_TYPES_ARRAY } from "@utils/types/models/vaultTransaction";
import dateService from "@utils/services/date.service";

const vaultTransactionSchema = new mongoose.Schema({
    vaultID: { type: mongoose.Schema.Types.ObjectId, ref: "vault", required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: VAULT_TRANSACTION_TYPES_ARRAY, required: true },
    description: { type: String },
    date: { type: Date, default: () => dateService.now() },
    createdAt: { type: Date, default: () => dateService.now() },
    updatedAt: { type: Date, default: () => dateService.now() }
});

vaultTransactionSchema.index({ vaultID: 1, date: -1 });

const vaultTransactionModel = mongoose.model("vaultTransaction", vaultTransactionSchema);

export default vaultTransactionModel;