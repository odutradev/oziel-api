import mongoose from "mongoose";

import { ROLES, ROLES_ARRAY, USER_STATUS_ARRAY, USER_STATUS } from "@utils/types/models/user";
import dateService from "@utils/services/date.service";

const userSchema = new mongoose.Schema({
    order: {
        type: Number,
        description: "Sequencial de ordenacao para listagens personalizadas"
    },
    name: {
        type: String,
        description: "Nome completo de apresentacao do usuario"
    },
    role: {
        type: String,
        enum: ROLES_ARRAY,
        default: ROLES.NORMAL,
        description: "Nivel de permissao de acesso ao sistema"
    },
    status: {
        type: String,
        enum: USER_STATUS_ARRAY,
        default: USER_STATUS.REGISTERED,
        description: "Status de ciclo de vida da conta"
    },
    createAt: {
        type: Date,
        default: () => dateService.now(),
        description: "Data e hora exata do registro inicial da conta"
    },
    lastUpdate: {
        type: Date,
        description: "Data e hora da ultima alteracao de perfil"
    },
    firstSignup: {
        type: Date,
        description: "Momento da primeira vez que o usuario concluiu o cadastro"
    },
    lastGetUser: {
        type: Date,
        description: "Registro de auditoria para ultimo acesso aos proprios dados"
    },
    description: {
        type: String,
        description: "Texto biografico ou anotacoes a respeito do usuario"
    },
    images: {
        profile: {
            type: String,
            description: "URL da imagem de avatar do perfil publico"
        }
    },
    password: {
        type: String,
        description: "Hash criptografado da senha de autenticacao"
    },
    email: {
        type: String,
        unique: true,
        description: "Endereco de correio eletronico para contato e login"
    },
    cpfOrRg: {
        type: String,
        description: "Documento unico de identificacao pessoal"
    }
});

const userModel = mongoose.model("user", userSchema);

export default userModel;