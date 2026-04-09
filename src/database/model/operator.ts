import mongoose from "mongoose";

import dateService from "@utils/services/date.service";

const operatorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        description: "Nome completo do operador"
    },
    document: {
        type: String,
        description: "Documento de identificação"
    },
    active: {
        type: Boolean,
        default: true,
        description: "Status de vínculo do operador"
    },
    createdAt: {
        type: Date,
        default: () => dateService.now(),
        description: "Data de criação do registro"
    },
    updatedAt: {
        type: Date,
        default: () => dateService.now(),
        description: "Data da última atualização"
    }
});

operatorSchema.index({ name: 1 });
operatorSchema.index({ active: 1 });

const operatorModel = mongoose.model("operator", operatorSchema);

export default operatorModel;