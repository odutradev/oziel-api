import mongoose from "mongoose";

import { VAULT_TRANSACTION_TYPES_ARRAY } from "@utils/types/models/vaultTransaction";
import dateService from "@utils/services/date.service";

const vaultTransactionSchema = new mongoose.Schema({
    vaultID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vault",
        required: true,
        description: "Referencia para qual cofre a transacao pertence"
    },
    amount: {
        type: Number,
        required: true,
        description: "Valor que foi adicionado ou subtraido do cofre"
    },
    type: {
        type: String,
        enum: VAULT_TRANSACTION_TYPES_ARRAY,
        required: true,
        description: "Natureza da transacao se deposito ou resgate"
    },
    description: {
        type: String,
        description: "Motivo documentado que originou a referida transacao"
    },
    date: {
        type: Date,
        default: () => dateService.now(),
        description: "Data contabeil da movimentacao de reserva"
    },
    createdAt: {
        type: Date,
        default: () => dateService.now(),
        description: "Timestamp real de inclusao na base de dados"
    },
    updatedAt: {
        type: Date,
        default: () => dateService.now(),
        description: "Timestamp real da ultima correcao dos dados"
    }
});

vaultTransactionSchema.index({ vaultID: 1, date: -1 });

const vaultTransactionModel = mongoose.model("vaultTransaction", vaultTransactionSchema);

export default vaultTransactionModel;