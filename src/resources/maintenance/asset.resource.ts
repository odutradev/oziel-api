import dateService from "@utils/services/date.service";
import assetModel from "@database/model/asset";

import type { ManageRequestBody } from "@middlewares/manageRequest";

type AssetPayload = {
    name: string;
    description?: string;
    active?: boolean;
};

const assetResource = {
    createAsset: async ({ data, createLog, ids, manageError }: ManageRequestBody) => {
        const payload = data as AssetPayload;
        if (!payload.name) return manageError({ code: "invalid_params" as never });

        const asset = await assetModel.create({ ...payload, active: payload.active ?? true });
        await createLog({ action: "system_action", entity: "system", entityID: asset._id.toString(), userID: ids.userID, data: { description: "Asset created", asset } });

        return asset;
    },
    updateAsset: async ({ params, data, createLog, ids, manageError }: ManageRequestBody) => {
        const assetID = params?.id as string;
        if (!assetID) return manageError({ code: "invalid_params" as never });

        const payload = data as Partial<AssetPayload>;
        const updatedAsset = await assetModel.findByIdAndUpdate(assetID, { ...payload, updatedAt: dateService.now() }, { new: true });
        if (!updatedAsset) return manageError({ code: "data_not_found" as never });

        await createLog({ action: "system_action", entity: "system", entityID: assetID, userID: ids.userID, data: { description: "Asset updated", data } });

        return updatedAsset;
    },
    deleteAsset: async ({ params, createLog, ids, manageError }: ManageRequestBody) => {
        const assetID = params?.id as string;
        if (!assetID) return manageError({ code: "invalid_params" as never });

        const deletedAsset = await assetModel.findByIdAndDelete(assetID);
        if (!deletedAsset) return manageError({ code: "data_not_found" as never });

        await createLog({ action: "system_action", entity: "system", entityID: assetID, userID: ids.userID, data: { description: "Asset deleted" } });

        return { success: true };
    },
    getAllAssets: async ({ querys, manageError }: ManageRequestBody) => {
        const pageNum = Number(querys?.page) || 1;
        const limitNum = Number(querys?.limit) || 10;
        if (pageNum < 1 || limitNum < 1) return manageError({ code: "invalid_params" as never });

        const skip = (pageNum - 1) * limitNum;
        const [data, total] = await Promise.all([
            assetModel.find().sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
            assetModel.countDocuments()
        ]);

        return { data, meta: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum } };
    },
    getAssetById: async ({ params, manageError }: ManageRequestBody) => {
        const assetID = params?.id as string;
        if (!assetID) return manageError({ code: "invalid_params" as never });

        const asset = await assetModel.findById(assetID).lean();
        if (!asset) return manageError({ code: "data_not_found" as never });

        return asset;
    }
};

export default assetResource;