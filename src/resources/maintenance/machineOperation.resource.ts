import machineOperationModel from "@database/model/machineOperation";
import dateService from "@utils/services/date.service";

import type { MachineOperationModelType, MachineOperationStatusType } from "@utils/types/models/machineOperation";
import type { ManageRequestBody } from "@middlewares/manageRequest";

const machineOperationResource = {
    createOperation: async ({ data, createLog, ids, manageError }: ManageRequestBody) => {
        const payload = data as Partial<MachineOperationModelType>;
        if (!payload.fleet || !payload.operator || !payload.operationDate || !payload.hourlyRate) return manageError({ code: "invalid_params" as never });

        const totalHours = (payload.hourMeterArrival ?? 0) - (payload.hourMeterDeparture ?? 0);
        const workedHours = (payload.hourMeterServiceEnd ?? 0) - (payload.hourMeterServiceStart ?? 0);
        const totalValue = workedHours * payload.hourlyRate;

        const operation = await machineOperationModel.create({ ...payload, totalHours, workedHours, totalValue });
        await createLog({ action: "system_action", entity: "system", entityID: operation._id.toString(), userID: ids.userID, data: { description: "Machine operation created", operation } });

        return operation;
    },
    updateOperation: async ({ params, data, createLog, ids, manageError }: ManageRequestBody) => {
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
    },
    deleteOperation: async ({ params, createLog, ids, manageError }: ManageRequestBody) => {
        const operationID = params?.id as string;
        if (!operationID) return manageError({ code: "invalid_params" as never });

        const deletedOperation = await machineOperationModel.findByIdAndDelete(operationID);
        if (!deletedOperation) return manageError({ code: "data_not_found" as never });

        await createLog({ action: "system_action", entity: "system", entityID: operationID, userID: ids.userID, data: { description: "Machine operation deleted" } });

        return { success: true };
    },
    getAllOperations: async ({ querys, manageError }: ManageRequestBody) => {
        const pageNum = Number(querys?.page) || 1;
        const limitNum = Number(querys?.limit) || 10;
        if (pageNum < 1 || limitNum < 1) return manageError({ code: "invalid_params" as never });

        const skip = (pageNum - 1) * limitNum;
        const [data, total] = await Promise.all([
            machineOperationModel.find().sort({ operationDate: -1 }).skip(skip).limit(limitNum).populate("fleet").populate("operator").lean(),
            machineOperationModel.countDocuments()
        ]);

        return { data, meta: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum } };
    },
    getMonthlyDashboard: async ({ querys, manageError }: ManageRequestBody) => {
        const year = Number(querys?.year);
        const month = Number(querys?.month);
        if (!year || !month) return manageError({ code: "invalid_params" as never });

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        const monthOperations = await machineOperationModel.find({ operationDate: { $gte: startDate, $lte: endDate } }).populate("fleet").populate("operator").sort({ operationDate: -1 }).lean();

        const totalWorkedHours = monthOperations.reduce((acc, curr) => acc + (curr.workedHours ?? 0), 0);
        const totalRevenue = monthOperations.reduce((acc, curr) => acc + (curr.totalValue ?? 0), 0);
        const pendingRevenue = monthOperations.filter(op => op.status === "PENDING").reduce((acc, curr) => acc + (curr.totalValue ?? 0), 0);
        const consolidatedRevenue = monthOperations.filter(op => op.status === "CONSOLIDATED").reduce((acc, curr) => acc + (curr.totalValue ?? 0), 0);

        return { metrics: { totalWorkedHours, totalRevenue, pendingRevenue, consolidatedRevenue }, operations: monthOperations };
    },
    getMonthlyClosingReport: async ({ querys, manageError }: ManageRequestBody) => {
        const year = Number(querys?.year);
        const month = Number(querys?.month);
        if (!year || !month) return manageError({ code: "invalid_params" as never });

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        const operations = await machineOperationModel.find({ operationDate: { $gte: startDate, $lte: endDate }, status: { $ne: "CANCELLED" } }).populate("operator").sort({ operationDate: 1 }).lean();

        const details = operations.map((op, index) => ({
            serviceOrder: index + 1,
            operatorName: (op.operator as { name?: string })?.name ?? "Desconhecido",
            description: op.serviceDescription,
            hours: op.workedHours,
            hourlyRate: op.hourlyRate,
            total: op.totalValue
        }));

        const totals = operations.reduce((acc, curr) => {
            acc.hours += curr.workedHours ?? 0;
            acc.revenue += curr.totalValue ?? 0;
            return acc;
        }, { hours: 0, revenue: 0 });

        const operatorTotalsMap = operations.reduce((acc, curr) => {
            const opName = (curr.operator as { name?: string })?.name ?? "Desconhecido";
            if (!acc[opName]) acc[opName] = { hours: 0, revenue: 0 };
            acc[opName].hours += curr.workedHours ?? 0;
            acc[opName].revenue += curr.totalValue ?? 0;
            return acc;
        }, {} as Record<string, { hours: number; revenue: number }>);

        const operatorTotals = Object.entries(operatorTotalsMap).map(([name, data]) => ({ name, ...data }));

        return { period: { year, month }, details, totals, operatorTotals };
    },
    updateOperationStatus: async ({ params, data, createLog, ids, manageError }: ManageRequestBody) => {
        const operationID = params?.id as string;
        if (!operationID) return manageError({ code: "invalid_params" as never });

        const { status } = data as { status: MachineOperationStatusType };
        if (!status) return manageError({ code: "invalid_params" as never });

        const updatedOperation = await machineOperationModel.findByIdAndUpdate(operationID, { status, updatedAt: dateService.now() }, { new: true });
        if (!updatedOperation) return manageError({ code: "data_not_found" as never });

        await createLog({ action: "system_action", entity: "system", entityID: operationID, userID: ids.userID, data: { description: `Machine operation status updated to ${status}` } });

        return updatedOperation;
    },
    getOperationById: async ({ params, manageError }: ManageRequestBody) => {
        const operationID = params?.id as string;
        if (!operationID) return manageError({ code: "invalid_params" as never });

        const operation = await machineOperationModel.findById(operationID).populate("fleet").populate("operator").lean();
        if (!operation) return manageError({ code: "data_not_found" as never });

        return operation;
    }
};

export default machineOperationResource;