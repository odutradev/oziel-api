import mongoose from "mongoose";

import dateService from "@utils/services/date.service";

const machineOperationSchema = new mongoose.Schema({
    fleet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "fleet",
        required: true,
        description: "Referência à frota utilizada"
    },
    operator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "operator",
        required: true,
        description: "Referência ao operador responsável"
    },
    serviceDescription: {
        type: String,
        required: true,
        description: "Descricao detalhada do servico e cliente destino"
    },
    operationDate: {
        type: Date,
        required: true,
        description: "Data em que a operacao foi realizada"
    },
    hourMeterDeparture: {
        type: Number,
        required: true,
        description: "Marcacao do horimetro na saida da maquina"
    },
    hourMeterArrival: {
        type: Number,
        required: true,
        description: "Marcacao do horimetro no retorno da maquina"
    },
    totalHours: {
        type: Number,
        required: true,
        description: "Total de horas calculadas entre saida e chegada"
    },
    hourMeterServiceStart: {
        type: Number,
        required: true,
        description: "Marcacao do horimetro no inicio do servico efetivo"
    },
    hourMeterServiceEnd: {
        type: Number,
        required: true,
        description: "Marcacao do horimetro no termino do servico efetivo"
    },
    workedHours: {
        type: Number,
        required: true,
        description: "Horas liquidas trabalhadas para cobranca"
    },
    fuelDepartureLiters: {
        type: Number,
        description: "Quantidade de combustivel em litros na saida"
    },
    fuelConsumptionLiters: {
        type: Number,
        description: "Consumo total de combustivel em litros"
    },
    hourlyRate: {
        type: Number,
        required: true,
        description: "Valor cobrado por hora de trabalho"
    },
    totalValue: {
        type: Number,
        required: true,
        description: "Valor total do servico"
    },
    status: {
        type: String,
        enum: ["PENDING", "CONSOLIDATED", "CANCELLED"],
        default: "PENDING",
        description: "Status da operacao para fechamento no final do mes"
    },
    createdAt: {
        type: Date,
        default: () => dateService.now()
    },
    updatedAt: {
        type: Date,
        default: () => dateService.now()
    }
});

machineOperationSchema.index({ operationDate: -1 });
machineOperationSchema.index({ operator: 1 });
machineOperationSchema.index({ status: 1 });
machineOperationSchema.index({ fleet: 1 });

const machineOperationModel = mongoose.model("machineOperation", machineOperationSchema);

export default machineOperationModel;