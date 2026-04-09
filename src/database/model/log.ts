import mongoose from "mongoose";

import dateService from "@utils/services/date.service";

const logSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: ["user_created", "user_updated", "user_deleted", "user_signin", "user_signup", "system_action"],
        description: "Identificacao da acao realizada"
    },
    entity: {
        type: String,
        required: true,
        enum: ["user", "system"],
        description: "Entidade do sistema que sofreu ou gerou a acao"
    },
    entityID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        description: "Identificador unico da entidade relacionada"
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        description: "Identificador do usuario que disparou a acao"
    },
    description: {
        type: String,
        required: true,
        description: "Descricao textual do evento ocorrido"
    },
    payload: {
        type: mongoose.Schema.Types.Mixed,
        description: "Dados adicionais do evento em formato flexivel"
    },
    metadata: {
        ip: {
            type: String,
            description: "Endereco IP de origem da requisicao"
        },
        userAgent: {
            type: String,
            description: "Dados do navegador ou cliente que originou a requisicao"
        },
        location: {
            type: String,
            description: "Localizacao geografica estimada pela requisicao"
        },
        additionalInfo: {
            type: mongoose.Schema.Types.Mixed,
            description: "Informacoes estruturadas adicionais do contexto"
        }
    },
    timestamp: {
        type: Date,
        default: () => dateService.now(),
        required: true,
        description: "Data e hora exata em que o log foi registrado"
    }
});

logSchema.index({ action: 1, timestamp: -1 });
logSchema.index({ entityID: 1, timestamp: -1 });
logSchema.index({ userID: 1, timestamp: -1 });

const logModel = mongoose.model("log", logSchema);

export default logModel;