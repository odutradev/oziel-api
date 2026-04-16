import contractModel from "@database/model/contract";
import dateService from "@utils/services/date.service";

import type { ContractModelType } from "@utils/types/models/contract";
import type { ManageRequestBody } from "@middlewares/manageRequest";

const contractResource = {
    createContract: async ({ data, createLog, ids, manageError }: ManageRequestBody) => {
        const payload = data as Partial<ContractModelType>;
        if (!payload.code || !payload.type || !payload.contractDate || !payload.deliveryForecast || typeof payload.totalValue !== "number" || typeof payload.totalSalePrice !== "number") return manageError({ code: "invalid_params" as never });

        const existingContract = await contractModel.findOne({ code: payload.code });
        if (existingContract) return manageError({ code: "data_already_exists" as never });

        const contract = await contractModel.create(payload);
        await createLog({ action: "system_action", entity: "system", entityID: contract._id.toString(), userID: ids.userID, data: { description: "Contract created", contract } });

        return contract;
    },
    updateContract: async ({ params, data, createLog, ids, manageError }: ManageRequestBody) => {
        const contractID = params?.id as string;
        if (!contractID) return manageError({ code: "invalid_params" as never });

        const payload = data as Partial<ContractModelType>;

        if (payload.code) {
            const existingContract = await contractModel.findOne({ code: payload.code, _id: { $ne: contractID } });
            if (existingContract) return manageError({ code: "data_already_exists" as never });
        }

        const updatedContract = await contractModel.findByIdAndUpdate(contractID, { ...payload, updatedAt: dateService.now() }, { new: true });
        if (!updatedContract) return manageError({ code: "data_not_found" as never });

        await createLog({ action: "system_action", entity: "system", entityID: contractID, userID: ids.userID, data: { description: "Contract updated", data } });

        return updatedContract;
    },
    deleteContract: async ({ params, createLog, ids, manageError }: ManageRequestBody) => {
        const contractID = params?.id as string;
        if (!contractID) return manageError({ code: "invalid_params" as never });

        const deletedContract = await contractModel.findByIdAndDelete(contractID);
        if (!deletedContract) return manageError({ code: "data_not_found" as never });

        await createLog({ action: "system_action", entity: "system", entityID: contractID, userID: ids.userID, data: { description: "Contract deleted" } });

        return { success: true };
    },
    getAllContracts: async ({ querys, manageError }: ManageRequestBody) => {
        const pageNum = Number(querys?.page) || 1;
        const limitNum = Number(querys?.limit) || 10;
        if (pageNum < 1 || limitNum < 1) return manageError({ code: "invalid_params" as never });

        const skip = (pageNum - 1) * limitNum;
        const [data, total] = await Promise.all([
            contractModel.find().sort({ contractDate: -1 }).skip(skip).limit(limitNum).lean(),
            contractModel.countDocuments()
        ]);

        return { data, meta: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum } };
    },
    getContractById: async ({ params, manageError }: ManageRequestBody) => {
        const contractID = params?.id as string;
        if (!contractID) return manageError({ code: "invalid_params" as never });

        const contract = await contractModel.findById(contractID).lean();
        if (!contract) return manageError({ code: "data_not_found" as never });

        return contract;
    }
};

export default contractResource;