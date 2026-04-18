import marketingRequestModel from "@database/model/marketingRequest"
import dateService from "@utils/services/date.service"

import type { MarketingRequestModelType } from "@utils/types/models/marketingRequest"
import type { ManageRequestBody } from "@middlewares/manageRequest"

const marketingCalendarResource = {
    scheduleDraft: async ({ params, data, createLog, ids, manageError }: ManageRequestBody) => {
        const draftID = params?.id as string
        const payload = data as Partial<MarketingRequestModelType>
        if (!draftID || !payload.plannedDate) return manageError({ code: "invalid_params" as never })

        const scheduledItem = await marketingRequestModel.findOneAndUpdate(
            { _id: draftID, status: "DRAFT" },
            { plannedDate: payload.plannedDate, status: "PLANNED", updatedAt: dateService.now() },
            { new: true }
        )
        if (!scheduledItem) return manageError({ code: "data_not_found" as never })

        await createLog({ action: "system_action", entity: "system", entityID: draftID, userID: ids.userID, data: { description: "Marketing draft scheduled to calendar", plannedDate: payload.plannedDate } })

        return scheduledItem
    },
    getCalendarItems: async ({ querys, manageError }: ManageRequestBody) => {
        const startDate = querys?.startDate as string
        const endDate = querys?.endDate as string
        const filter: Record<string, unknown> = { status: { $ne: "DRAFT" } }

        if (startDate && endDate) {
            filter.plannedDate = { $gte: new Date(startDate), $lte: new Date(endDate) }
        }

        const data = await marketingRequestModel.find(filter).sort({ plannedDate: 1 }).populate("requester", "name email").populate("approvedBy", "name email").lean()

        return { data }
    },
    updateCalendarItem: async ({ params, data, createLog, ids, manageError }: ManageRequestBody) => {
        const itemID = params?.id as string
        if (!itemID) return manageError({ code: "invalid_params" as never })

        const payload = data as Partial<MarketingRequestModelType>
        const updatedItem = await marketingRequestModel.findOneAndUpdate(
            { _id: itemID, status: { $ne: "DRAFT" } },
            { ...payload, updatedAt: dateService.now() },
            { new: true }
        )
        if (!updatedItem) return manageError({ code: "data_not_found" as never })

        await createLog({ action: "system_action", entity: "system", entityID: itemID, userID: ids.userID, data: { description: "Marketing calendar item updated", data } })

        return updatedItem
    },
    sendForApproval: async ({ params, createLog, ids, manageError }: ManageRequestBody) => {
        const itemID = params?.id as string
        if (!itemID) return manageError({ code: "invalid_params" as never })

        const updatedItem = await marketingRequestModel.findOneAndUpdate(
            { _id: itemID, status: "PLANNED" },
            { status: "WAITING_APPROVAL", updatedAt: dateService.now() },
            { new: true }
        )
        if (!updatedItem) return manageError({ code: "data_not_found" as never })

        await createLog({ action: "system_action", entity: "system", entityID: itemID, userID: ids.userID, data: { description: "Marketing item sent for approval" } })

        return updatedItem
    },
    reviewApproval: async ({ params, data, createLog, ids, manageError }: ManageRequestBody) => {
        const itemID = params?.id as string
        const payload = data as { approved: boolean; feedbackNotes?: string }
        if (!itemID || typeof payload.approved !== "boolean") return manageError({ code: "invalid_params" as never })

        const status = payload.approved ? "APPROVED" : "REVISION_REQUIRED"
        const updatedItem = await marketingRequestModel.findOneAndUpdate(
            { _id: itemID, status: "WAITING_APPROVAL" },
            { status, feedbackNotes: payload.feedbackNotes, approvedBy: ids.userID, updatedAt: dateService.now() },
            { new: true }
        )
        if (!updatedItem) return manageError({ code: "data_not_found" as never })

        await createLog({ action: "system_action", entity: "system", entityID: itemID, userID: ids.userID, data: { description: `Marketing item reviewed: ${status}`, feedbackNotes: payload.feedbackNotes } })

        return updatedItem
    }
}

export default marketingCalendarResource