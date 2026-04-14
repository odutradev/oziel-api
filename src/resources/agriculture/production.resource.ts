import productionModel from "@database/model/production";
import dateService from "@utils/services/date.service";
import productModel from "@database/model/product";
import userModel from "@database/model/user";

import type { ProductionModelType } from "@utils/types/models/production";
import type { ManageRequestBody } from "@middlewares/manageRequest";

const productionResource = {
    createProduction: async ({ data, createLog, ids, manageError }: ManageRequestBody) => {
        const payload = data as Partial<ProductionModelType>;
        if (!payload.producer || !payload.product || !payload.referenceYear || typeof payload.quantity !== "number" || typeof payload.productionArea !== "number") return manageError({ code: "invalid_params" as never });

        const producerCheck = await userModel.findOne({ _id: payload.producer, "hrControl.isMonitored": true });
        if (!producerCheck) return manageError({ code: "data_not_found" as never });

        const productCheck = await productModel.findById(payload.product);
        if (!productCheck) return manageError({ code: "data_not_found" as never });

        const production = await productionModel.create({ ...payload, active: payload.active ?? true });
        await createLog({ action: "system_action", entity: "system", entityID: production._id.toString(), userID: ids.userID, data: { description: "Production created", production } });

        return production;
    },
    updateProduction: async ({ params, data, createLog, ids, manageError }: ManageRequestBody) => {
        const productionID = params?.id as string;
        if (!productionID) return manageError({ code: "invalid_params" as never });

        const payload = data as Partial<ProductionModelType>;

        if (payload.producer) {
            const producerCheck = await userModel.findOne({ _id: payload.producer, "hrControl.isMonitored": true });
            if (!producerCheck) return manageError({ code: "data_not_found" as never });
        }

        if (payload.product) {
            const productCheck = await productModel.findById(payload.product);
            if (!productCheck) return manageError({ code: "data_not_found" as never });
        }

        const updatedProduction = await productionModel.findByIdAndUpdate(productionID, { ...payload, updatedAt: dateService.now() }, { new: true });
        if (!updatedProduction) return manageError({ code: "data_not_found" as never });

        await createLog({ action: "system_action", entity: "system", entityID: productionID, userID: ids.userID, data: { description: "Production updated", data } });

        return updatedProduction;
    },
    deleteProduction: async ({ params, createLog, ids, manageError }: ManageRequestBody) => {
        const productionID = params?.id as string;
        if (!productionID) return manageError({ code: "invalid_params" as never });

        const deletedProduction = await productionModel.findByIdAndDelete(productionID);
        if (!deletedProduction) return manageError({ code: "data_not_found" as never });

        await createLog({ action: "system_action", entity: "system", entityID: productionID, userID: ids.userID, data: { description: "Production deleted" } });

        return { success: true };
    },
    getAllProductions: async ({ querys, manageError }: ManageRequestBody) => {
        const pageNum = Number(querys?.page) || 1;
        const limitNum = Number(querys?.limit) || 10;
        if (pageNum < 1 || limitNum < 1) return manageError({ code: "invalid_params" as never });

        const skip = (pageNum - 1) * limitNum;
        const [data, total] = await Promise.all([
            productionModel.find().sort({ createdAt: -1 }).skip(skip).limit(limitNum).populate("producer", "name cpfOrRg").populate("product", "name unit").lean(),
            productionModel.countDocuments()
        ]);

        return { data, meta: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum } };
    },
    getProductionById: async ({ params, manageError }: ManageRequestBody) => {
        const productionID = params?.id as string;
        if (!productionID) return manageError({ code: "invalid_params" as never });

        const production = await productionModel.findById(productionID).populate("producer", "name cpfOrRg").populate("product", "name unit").lean();
        if (!production) return manageError({ code: "data_not_found" as never });

        return production;
    }
};

export default productionResource;