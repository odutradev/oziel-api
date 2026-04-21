import meetingMinuteModel from "@database/model/meetingMinute"
import dateService from "@utils/services/date.service"

import type { ManageRequestBody } from "@middlewares/manageRequest"

const meetingMinuteResource = {
    createMinute: async ({ data, createLog, ids, manageError }: ManageRequestBody) => {
        const payload = data as { title: string; date: Date; content: string }
        if (!payload.title || !payload.date || !payload.content) return manageError({ code: "invalid_params" as never })
        const minute = await meetingMinuteModel.create({
            title: payload.title,
            date: payload.date,
            history: [{ content: payload.content, updatedBy: ids.userID }]
        })
        await createLog({ action: "system_action", entity: "system", entityID: minute._id.toString(), userID: ids.userID, data: { description: "Meeting minute created", minute } })
        return minute
    },
    updateMinute: async ({ params, data, createLog, ids, manageError }: ManageRequestBody) => {
        const minuteID = params?.id as string
        const payload = data as { title?: string; date?: Date; content: string }
        if (!minuteID || !payload.content) return manageError({ code: "invalid_params" as never })
        const updateData: Record<string, unknown> = { updatedAt: dateService.now() }
        if (payload.title) updateData.title = payload.title
        if (payload.date) updateData.date = payload.date
        const updatedMinute = await meetingMinuteModel.findOneAndUpdate(
            { _id: minuteID },
            {
                $set: updateData,
                $push: { history: { content: payload.content, updatedBy: ids.userID, updatedAt: dateService.now() } }
            },
            { new: true }
        )
        if (!updatedMinute) return manageError({ code: "data_not_found" as never })
        await createLog({ action: "system_action", entity: "system", entityID: minuteID, userID: ids.userID, data: { description: "Meeting minute history appended", data } })
        return updatedMinute
    },
    getAllMinutes: async ({ querys, manageError }: ManageRequestBody) => {
        const pageNum = Number(querys?.page) || 1
        const limitNum = Number(querys?.limit) || 10
        if (pageNum < 1 || limitNum < 1) return manageError({ code: "invalid_params" as never })
        const skip = (pageNum - 1) * limitNum
        const [data, total] = await Promise.all([
            meetingMinuteModel.find().sort({ date: -1 }).skip(skip).limit(limitNum).populate("history.updatedBy", "name email").lean(),
            meetingMinuteModel.countDocuments()
        ])
        return { data, meta: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum } }
    },
    getMinuteById: async ({ params, manageError }: ManageRequestBody) => {
        const minuteID = params?.id as string
        if (!minuteID) return manageError({ code: "invalid_params" as never })
        const data = await meetingMinuteModel.findOne({ _id: minuteID }).populate("history.updatedBy", "name email").lean()
        if (!data) return manageError({ code: "data_not_found" as never })
        return { data }
    },
    deleteMinute: async ({ params, createLog, ids, manageError }: ManageRequestBody) => {
        const minuteID = params?.id as string
        if (!minuteID) return manageError({ code: "invalid_params" as never })
        const deletedMinute = await meetingMinuteModel.findOneAndDelete({ _id: minuteID })
        if (!deletedMinute) return manageError({ code: "data_not_found" as never })
        await createLog({ action: "system_action", entity: "system", entityID: minuteID, userID: ids.userID, data: { description: "Meeting minute deleted" } })
        return { success: true }
    }
}

export default meetingMinuteResource