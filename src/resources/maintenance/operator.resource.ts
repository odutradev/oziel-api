import operatorModel from "@database/model/operator";
import dateService from "@utils/services/date.service";

import type { ManageRequestBody } from "@middlewares/manageRequest";

type OperatorPayload = {
    name: string;
    document?: string;
    active?: boolean;
};

const operatorResource = {
    createOperator: async ({ data, createLog, ids, manageError }: ManageRequestBody) => {
        const payload = data as OperatorPayload;
        if (!payload.name) return manageError({ code: "invalid_params" as never });

        const operator = await operatorModel.create({ ...payload, active: payload.active ?? true });
        await createLog({ action: "system_action", entity: "system", entityID: operator._id.toString(), userID: ids.userID, data: { description: "Operator created", operator } });

        return operator;
    },
    updateOperator: async ({ params, data, createLog, ids, manageError }: ManageRequestBody) => {
        const operatorID = params?.id as string;
        if (!operatorID) return manageError({ code: "invalid_params" as never });

        const payload = data as Partial<OperatorPayload>;
        const updatedOperator = await operatorModel.findByIdAndUpdate(operatorID, { ...payload, updatedAt: dateService.now() }, { new: true });
        if (!updatedOperator) return manageError({ code: "data_not_found" as never });

        await createLog({ action: "system_action", entity: "system", entityID: operatorID, userID: ids.userID, data: { description: "Operator updated", data } });

        return updatedOperator;
    },
    deleteOperator: async ({ params, createLog, ids, manageError }: ManageRequestBody) => {
        const operatorID = params?.id as string;
        if (!operatorID) return manageError({ code: "invalid_params" as never });

        const deletedOperator = await operatorModel.findByIdAndDelete(operatorID);
        if (!deletedOperator) return manageError({ code: "data_not_found" as never });

        await createLog({ action: "system_action", entity: "system", entityID: operatorID, userID: ids.userID, data: { description: "Operator deleted" } });

        return { success: true };
    },
    getAllOperators: async ({ querys, manageError }: ManageRequestBody) => {
        const pageNum = Number(querys?.page) || 1;
        const limitNum = Number(querys?.limit) || 10;
        if (pageNum < 1 || limitNum < 1) return manageError({ code: "invalid_params" as never });

        const skip = (pageNum - 1) * limitNum;
        const [data, total] = await Promise.all([
            operatorModel.find().sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
            operatorModel.countDocuments()
        ]);

        return { data, meta: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum } };
    },
    getOperatorById: async ({ params, manageError }: ManageRequestBody) => {
        const operatorID = params?.id as string;
        if (!operatorID) return manageError({ code: "invalid_params" as never });

        const operator = await operatorModel.findById(operatorID).lean();
        if (!operator) return manageError({ code: "data_not_found" as never });

        return operator;
    }
};

export default operatorResource;