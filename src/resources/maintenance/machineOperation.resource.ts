import machineOperationModel from "@database/model/machineOperation";
import dateService from "@utils/services/date.service";

import type { MachineOperationModelType, MachineOperationStatusType } from "@utils/types/models/machineOperation";
import type { ManageRequestBody } from "@middlewares/manageRequest";

const createOperation = async ({ data, createLog, ids, manageError }: ManageRequestBody) => {
    const payload = data as Partial<MachineOperationModelType>;
    if (!payload.fleet || !payload.operator || !payload.operationDate || !payload.hourlyRate) return manageError({ code: "invalid_params" as never });

    const totalHours = (payload.hourMeterArrival ?? 0) - (payload.hourMeterDeparture ?? 0);
    const workedHours = (payload.hourMeterServiceEnd ?? 0) - (payload.hourMeterServiceStart ?? 0);
    const totalValue = workedHours * payload.hourlyRate;

    const operation = await machineOperationModel.create({ ...payload, totalHours, workedHours, totalValue });
    await createLog({ action: "system_action", entity: "system", entityID: operation._id.toString(), userID: ids.userID, data: { description: "Machine operation created", operation } });

    return operation;
};

const updateOperation = async ({ params, data, createLog, ids, manageError }: ManageRequestBody) => {
    const operationID = params?.id as string;
    if (!operationID) return manageError({ code: "invalid_params" as never });

    const payload = data as Partial<MachineOperationModelType>;
    const existingOperation = await machineOperationModel.findById(operationID);
    if (!existingOperation) return manageError({ code: "data_not_found" as never });

    const hourlyRate = payload.hourlyRate ?? existingOperation.hourlyRate;
    const hourMeterArrival = payload.hourMeterArrival ?? existingOperation.hourMeterArrival;
    const hourMeterDeparture = payload.hourMeterDeparture ?? existingOperation.hourMeterDeparture;
    const hourMeterServiceEnd = payload.hourMeterServiceEnd ?? existingOperation.hourMeterServiceEnd;
    const hourMeterServiceStart = payload.hourMeterServiceStart ?? existingOperation.hourMeterServiceStart;

    const totalHours = hourMeterArrival - hourMeterDeparture;
    const workedHours = hourMeterServiceEnd - hourMeterServiceStart;
    const totalValue = workedHours * hourlyRate;

    const updatedOperation = await machineOperationModel.findByIdAndUpdate(operationID, { ...payload, totalHours, workedHours, totalValue, updatedAt: dateService.now() }, { new: true });
    if (!updatedOperation) return manageError({ code: "data_not_found" as never });

    await createLog({ action: "system_action", entity: "system", entityID: operationID, userID: ids.userID, data: { description: "Machine operation updated", data } });

    return updatedOperation;
};

const deleteOperation = async ({ params, createLog, ids, manageError }: ManageRequestBody) => {
    const operationID = params?.id as string;
    if (!operationID) return manageError({ code: "invalid_params" as never });

    const deletedOperation = await machineOperationModel.findByIdAndDelete(operationID);
    if (!deletedOperation) return manageError({ code: "data_not_found" as never });

    await createLog({ action: "system_action", entity: "system", entityID: operationID, userID: ids.userID, data: { description: "Machine operation deleted" } });

    return { success: true };
};

const getAllOperations = async ({ querys, manageError }: ManageRequestBody) => {
    const pageNum = Number(querys?.page) || 1;
    const limitNum = Number(querys?.limit) || 10;
    if (pageNum < 1 || limitNum < 1) return manageError({ code: "invalid_params" as never });

    const skip = (pageNum - 1) * limitNum;
    const [data, total] = await Promise.all([
        machineOperationModel.find().sort({ operationDate: -1 }).skip(skip).limit(limitNum).lean(),
        machineOperationModel.countDocuments()
    ]);

    return { data, meta: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum } };
};

const updateOperationStatus = async ({ params, data, createLog, ids, manageError }: ManageRequestBody) => {
    const operationID = params?.id as string;
    if (!operationID) return manageError({ code: "invalid_params" as never });

    const { status } = data as { status: MachineOperationStatusType };
    if (!status) return manageError({ code: "invalid_params" as never });

    const updatedOperation = await machineOperationModel.findByIdAndUpdate(operationID, { status, updatedAt: dateService.now() }, { new: true });
    if (!updatedOperation) return manageError({ code: "data_not_found" as never });

    await createLog({ action: "system_action", entity: "system", entityID: operationID, userID: ids.userID, data: { description: `Machine operation status updated to ${status}` } });

    return updatedOperation;
};

const getOperationById = async ({ params, manageError }: ManageRequestBody) => {
    const operationID = params?.id as string;
    if (!operationID) return manageError({ code: "invalid_params" as never });

    const operation = await machineOperationModel.findById(operationID).lean();
    if (!operation) return manageError({ code: "data_not_found" as never });

    return operation;
};

const machineOperationResource = {
    createOperation,
    updateOperation,
    deleteOperation,
    getAllOperations,
    getOperationById,
    updateOperationStatus
};

export default machineOperationResource;