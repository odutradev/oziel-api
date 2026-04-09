import mongoose from "mongoose";

import { RECURRING_FREQUENCIES_ARRAY } from "@utils/types/models/recurringTransaction";
import { TRANSACTION_TYPES_ARRAY } from "@utils/types/models/transaction";
import dateService from "@utils/services/date.service";

const recurringTransactionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        description: "Titulo descritivo da transacao recorrente"
    },
    amount: {
        type: Number,
        required: true,
        description: "Valor monetario da transacao recorrente"
    },
    type: {
        type: String,
        enum: TRANSACTION_TYPES_ARRAY,
        required: true,
        description: "Tipo de fluxo da transacao (entrada ou saida)"
    },
    frequency: {
        type: String,
        enum: RECURRING_FREQUENCIES_ARRAY,
        required: true,
        description: "Periodicidade de repeticao da transacao"
    },
    dayOfMonth: {
        type: Number,
        min: 1,
        max: 31,
        description: "Dia fixo do mes para execucao da transacao"
    },
    intervalDays: {
        type: Number,
        min: 1,
        description: "Intervalo customizado de dias entre as execucoes"
    },
    nextExecution: {
        type: Date,
        required: true,
        description: "Data programada para a proxima recorrencia"
    },
    active: {
        type: Boolean,
        default: true,
        description: "Status que indica se a recorrencia segue gerando novas transacoes"
    },
    description: {
        type: String,
        description: "Detalhes complementares sobre a natureza desta transacao"
    },
    category: {
        type: String,
        description: "Categoria financeira para agrupamento de relatorios"
    },
    createdAt: {
        type: Date,
        default: () => dateService.now(),
        description: "Data de criacao do agendamento"
    },
    updatedAt: {
        type: Date,
        default: () => dateService.now(),
        description: "Data da ultima alteracao no agendamento"
    }
});

recurringTransactionSchema.index({ nextExecution: 1, active: 1 });
recurringTransactionSchema.index({ type: 1 });

const recurringTransactionModel = mongoose.model("recurringTransaction", recurringTransactionSchema);

export default recurringTransactionModel;