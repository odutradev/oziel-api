import mongoose from "mongoose";

import dateService from "@utils/services/date.service";

const emailTemplateSchema = new mongoose.Schema({
    trigger: {
        type: String,
        required: true,
        unique: true,
        enum: ["PASSWORD_RESET", "PASSWORD_CHANGED"],
        description: "Gatilho de disparo do template de email"
    },
    subject: {
        type: String,
        required: true,
        description: "Assunto principal do email"
    },
    markdownBody: {
        type: String,
        required: true,
        description: "Conteudo do email formatado em markdown"
    },
    variables: {
        type: [String],
        default: [],
        description: "Lista de variaveis dinamicas aceitas no template"
    },
    description: {
        type: String,
        description: "Breve descricao da finalidade do template"
    },
    active: {
        type: Boolean,
        default: true,
        description: "Define se o template de email esta ativo"
    },
    createdAt: {
        type: Date,
        default: () => dateService.now(),
        description: "Data de criacao do registro"
    },
    updatedAt: {
        type: Date,
        default: () => dateService.now(),
        description: "Data da ultima atualizacao do registro"
    }
});

emailTemplateSchema.index({ trigger: 1 });
emailTemplateSchema.index({ active: 1 });

const emailTemplateModel = mongoose.model("emailTemplate", emailTemplateSchema);

export default emailTemplateModel;