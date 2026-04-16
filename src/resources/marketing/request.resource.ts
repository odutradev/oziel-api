import marketingRequestModel from "@database/model/marketingRequest";
import dateService from "@utils/services/date.service";

import type { MarketingRequestModelType } from "@utils/types/models/marketingRequest";
import type { ManageRequestBody } from "@middlewares/manageRequest";

const marketingRequestResource = {
    createRequest: async ({ data, createLog, ids, manageError }: ManageRequestBody) => {
        const payload = data as Partial<MarketingRequestModelType>;
        if (!payload.title || !payload.description) return manageError({ code: "invalid_params" as never });

        const request = await marketingRequestModel.create({ ...payload, requester: ids.userID });
        await createLog({ action: "system_action", entity: "system", entityID: request._id.toString(), userID: ids.userID, data: { description: "Marketing request created", request } });

        return request;
    },
    updateRequest: async ({ params, data, createLog, ids, manageError }: ManageRequestBody) => {
        const requestID = params?.id as string;
        if (!requestID) return manageError({ code: "invalid_params" as never });

        const payload = data as Partial<MarketingRequestModelType>;
        const updatedRequest = await marketingRequestModel.findByIdAndUpdate(requestID, { ...payload, updatedAt: dateService.now() }, { new: true });
        if (!updatedRequest) return manageError({ code: "data_not_found" as never });

        await createLog({ action: "system_action", entity: "system", entityID: requestID, userID: ids.userID, data: { description: "Marketing request updated", data } });

        return updatedRequest;
    },
    sendForApproval: async ({ params, createLog, ids, manageError }: ManageRequestBody) => {
        const requestID = params?.id as string;
        if (!requestID) return manageError({ code: "invalid_params" as never });

        const request = await marketingRequestModel.findById(requestID);
        if (!request) return manageError({ code: "data_not_found" as never });

        const updatedRequest = await marketingRequestModel.findByIdAndUpdate(requestID, { status: "WAITING_APPROVAL", updatedAt: dateService.now() }, { new: true });
        await createLog({ action: "system_action", entity: "system", entityID: requestID, userID: ids.userID, data: { description: "Marketing request sent for approval" } });

        return updatedRequest;
    },
    reviewApproval: async ({ params, data, createLog, ids, manageError }: ManageRequestBody) => {
        const requestID = params?.id as string;
        const payload = data as { approved: boolean; feedbackNotes?: string };
        if (!requestID || typeof payload.approved !== "boolean") return manageError({ code: "invalid_params" as never });

        const request = await marketingRequestModel.findById(requestID);
        if (!request) return manageError({ code: "data_not_found" as never });

        const status = payload.approved ? "APPROVED" : "REVISION_REQUIRED";
        const updatedRequest = await marketingRequestModel.findByIdAndUpdate(requestID, { status, feedbackNotes: payload.feedbackNotes, approvedBy: ids.userID, updatedAt: dateService.now() }, { new: true });

        await createLog({ action: "system_action", entity: "system", entityID: requestID, userID: ids.userID, data: { description: `Marketing request reviewed: ${status}`, feedbackNotes: payload.feedbackNotes } });

        return updatedRequest;
    },
    deleteRequest: async ({ params, createLog, ids, manageError }: ManageRequestBody) => {
        const requestID = params?.id as string;
        if (!requestID) return manageError({ code: "invalid_params" as never });

        const deletedRequest = await marketingRequestModel.findByIdAndDelete(requestID);
        if (!deletedRequest) return manageError({ code: "data_not_found" as never });

        await createLog({ action: "system_action", entity: "system", entityID: requestID, userID: ids.userID, data: { description: "Marketing request deleted" } });

        return { success: true };
    },
    getAllRequests: async ({ querys, manageError }: ManageRequestBody) => {
        const pageNum = Number(querys?.page) || 1;
        const limitNum = Number(querys?.limit) || 10;
        if (pageNum < 1 || limitNum < 1) return manageError({ code: "invalid_params" as never });

        const skip = (pageNum - 1) * limitNum;
        const [data, total] = await Promise.all([
            marketingRequestModel.find().sort({ createdAt: -1 }).skip(skip).limit(limitNum).populate("requester", "name email").populate("approvedBy", "name email").lean(),
            marketingRequestModel.countDocuments()
        ]);

        return { data, meta: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum } };
    },
    getRequestById: async ({ params, manageError }: ManageRequestBody) => {
        const requestID = params?.id as string;
        if (!requestID) return manageError({ code: "invalid_params" as never });

        const request = await marketingRequestModel.findById(requestID).populate("requester", "name email").populate("approvedBy", "name email").lean();
        if (!request) return manageError({ code: "data_not_found" as never });

        return request;
    }
};

export default marketingRequestResource;