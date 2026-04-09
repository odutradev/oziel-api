import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        description: "Identificador do usuario solicitante"
    },
    email: {
        type: String,
        required: true,
        description: "Endereco de email vinculado a solicitacao"
    },
    code: {
        type: String,
        required: true,
        description: "Codigo seguro de verificacao gerado"
    },
    verified: {
        type: Boolean,
        default: false,
        description: "Indica se o codigo de redefinicao ja foi validado"
    },
    attempts: {
        type: Number,
        default: 0,
        description: "Contagem de tentativas de validacao invalidas"
    },
    expiresAt: {
        type: Date,
        required: true,
        description: "Momento exato em que a validade do codigo expira"
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
        description: "Data de criacao do registro de redefinicao"
    }
});

passwordResetSchema.index({ userID: 1, createdAt: -1 });
passwordResetSchema.index({ email: 1, createdAt: -1 });
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const passwordResetModel = mongoose.model("passwordReset", passwordResetSchema);

export default passwordResetModel;