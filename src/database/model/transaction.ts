import mongoose from "mongoose";

import { TRANSACTION_STATUS_ARRAY, TRANSACTION_TYPES_ARRAY, TRANSACTION_STATUS } from "@utils/types/models/transaction";
import dateService from "@utils/services/date.service";

const transactionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        description: "Titulo principal identificador da transacao"
    },
    amount: {
        type: Number,
        required: true,
        description: "Valor absoluto registrado nesta movimentacao"
    },
    type: {
        type: String,
        enum: TRANSACTION_TYPES_ARRAY,
        required: true,
        description: "Classificacao da operacao como entrada ou saida"
    },
    status: {
        type: String,
        enum: TRANSACTION_STATUS_ARRAY,
        default: TRANSACTION_STATUS.PENDING,
        description: "Estado atual de efetivacao da transacao"
    },
    date: {
        type: Date,
        required: true,
        description: "Data de referencia contabeil para a transacao"
    },
    description: {
        type: String,
        description: "Anotacoes adicionais de detalhamento operacional"
    },
    category: {
        type: String,
        description: "Agrupador categorico para facilitar analise financeira"
    },
    createdAt: {
        type: Date,
        default: () => dateService.now(),
        description: "Momento exato da inclusao no sistema"
    },
    updatedAt: {
        type: Date,
        default: () => dateService.now(),
        description: "Momento da ultima atualizacao dos dados"
    }
});

transactionSchema.index({ date: -1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ type: 1 });

const transactionModel = mongoose.model("transaction", transactionSchema);

export default transactionModel;