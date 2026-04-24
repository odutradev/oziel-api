import marketingRequestModel from "@database/model/marketingRequest"

import type { MarketingRequestModelType } from "@utils/types/models/marketingRequest"
import type { ManageRequestBody } from "@middlewares/manageRequest"

const marketingDraftResource = {
    createDraft: async ({ data, createLog, ids, manageError }: ManageRequestBody) => {
        const payload = data as Partial<MarketingRequestModelType>
        if (!payload.title || !payload.description) return manageError({ code: "invalid_params" as never })
        const draft = await marketingRequestModel.create({ ...payload, requester: ids?.userID, status: "DRAFT" })
        await createLog({ action: "system_action", entity: "system", entityID: draft._id.toString(), userID: ids?.userID, data: { description: "Marketing draft created", draft } })
        return draft.toObject()
    },
    updateDraft: async ({ params, data, createLog, ids, manageError }: ManageRequestBody) => {
        const draftID = params?.id as string
        const payload = data as Partial<MarketingRequestModelType>
        if (!draftID) return manageError({ code: "invalid_params" as never })
        const updatedDraft = await marketingRequestModel.findOneAndUpdate(
            { _id: draftID, status: "DRAFT" },
            { $set: { ...payload, updatedAt: new Date() } },
            { new: true }
        ).lean()
        if (!updatedDraft) return manageError({ code: "data_not_found" as never })
        await createLog({ action: "system_action", entity: "system", entityID: draftID, userID: ids?.userID, data: { description: "Marketing draft updated", data } })
        return updatedDraft
    },
    deleteDraft: async ({ params, createLog, ids, manageError }: ManageRequestBody) => {
        const draftID = params?.id as string
        if (!draftID) return manageError({ code: "invalid_params" as never })
        const deletedDraft = await marketingRequestModel.findOneAndDelete({ _id: draftID, status: "DRAFT" }).lean()
        if (!deletedDraft) return manageError({ code: "data_not_found" as never })
        await createLog({ action: "system_action", entity: "system", entityID: draftID, userID: ids?.userID, data: { description: "Marketing draft deleted" } })
        return { success: true }
    },
    getAllDrafts: async ({ querys, manageError }: ManageRequestBody) => {
        const pageNum = Number(querys?.page) || 1
        const limitNum = Number(querys?.limit) || 10
        if (pageNum < 1 || limitNum < 1) return manageError({ code: "invalid_params" as never })
        const skip = (pageNum - 1) * limitNum
        const [data, total] = await Promise.all([
            marketingRequestModel.find({ status: "DRAFT" }).sort({ createdAt: -1 }).skip(skip).limit(limitNum).populate("requester", "name email").lean(),
            marketingRequestModel.countDocuments({ status: "DRAFT" })
        ])
        return { data, meta: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum } }
    },
    getDraft: async ({ params, manageError }: ManageRequestBody) => {
        const draftID = params?.id as string
        if (!draftID) return manageError({ code: "invalid_params" as never })
        const data = await marketingRequestModel.findOne({ _id: draftID, status: "DRAFT" }).populate("requester", "name email").lean()
        if (!data) return manageError({ code: "data_not_found" as never })
        return { data }
    }
}

export default marketingDraftResource