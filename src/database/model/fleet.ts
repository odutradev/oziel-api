import mongoose from "mongoose";

import dateService from "@utils/services/date.service";

const fleetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        description: "Nome ou código de identificação da frota"
    },
    description: {
        type: String,
        description: "Descrição detalhada do veículo ou máquina"
    },
    active: {
        type: Boolean,
        default: true,
        description: "Status de operação da frota"
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

fleetSchema.index({ name: 1 });
fleetSchema.index({ active: 1 });

const fleetModel = mongoose.model("fleet", fleetSchema);

export default fleetModel;