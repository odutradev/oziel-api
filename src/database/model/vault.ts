import mongoose from "mongoose";

import dateService from "@utils/services/date.service";

const vaultSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        description: "Nome identificador deste cofre especifico"
    },
    balance: {
        type: Number,
        default: 0,
        description: "Saldo financeiro consolidado acumulado no cofre"
    },
    goal: {
        type: Number,
        description: "Objetivo final ou meta financeira para este cofre"
    },
    description: {
        type: String,
        description: "Explicacao aprofundada da finalidade desta reserva"
    },
    createdAt: {
        type: Date,
        default: () => dateService.now(),
        description: "Data em que o cofre foi aberto no sistema"
    },
    updatedAt: {
        type: Date,
        default: () => dateService.now(),
        description: "Ultima movimentacao ou atualizacao meta de dados"
    }
});

vaultSchema.index({ name: 1 });

const vaultModel = mongoose.model("vault", vaultSchema);

export default vaultModel;