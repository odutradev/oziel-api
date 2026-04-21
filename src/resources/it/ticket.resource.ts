import dateService from "@utils/services/date.service";
import ticketModel from "@database/model/ticket";

import type { ManageRequestBody } from "@middlewares/manageRequest";
import type { TicketModelType } from "@utils/types/models/ticket";

const ticketResource = {
    createTicket: async ({ data, createLog, ids, manageError }: ManageRequestBody) => {
        const payload = data as Partial<TicketModelType>;
        if (!payload.title || !payload.description) return manageError({ code: "invalid_params" as never });

        const ticket = await ticketModel.create({ ...payload, requester: ids.userID });
        await createLog({ action: "system_action", entity: "system", entityID: ticket._id.toString(), userID: ids.userID, data: { description: "Ticket created", ticket } });

        return ticket;
    },
    updateTicket: async ({ params, data, createLog, ids, manageError }: ManageRequestBody) => {
        const ticketID = params?.id as string;
        if (!ticketID) return manageError({ code: "invalid_params" as never });

        const payload = data as Partial<TicketModelType>;
        const updatedTicket = await ticketModel.findByIdAndUpdate(ticketID, { ...payload, updatedAt: dateService.now() }, { new: true });
        if (!updatedTicket) return manageError({ code: "data_not_found" as never });

        await createLog({ action: "system_action", entity: "system", entityID: ticketID, userID: ids.userID, data: { description: "Ticket updated", data } });

        return updatedTicket;
    },
    deleteTicket: async ({ params, createLog, ids, manageError }: ManageRequestBody) => {
        const ticketID = params?.id as string;
        if (!ticketID) return manageError({ code: "invalid_params" as never });

        const deletedTicket = await ticketModel.findByIdAndDelete(ticketID);
        if (!deletedTicket) return manageError({ code: "data_not_found" as never });

        await createLog({ action: "system_action", entity: "system", entityID: ticketID, userID: ids.userID, data: { description: "Ticket deleted" } });

        return { success: true };
    },
    getAllTickets: async ({ querys, manageError }: ManageRequestBody) => {
        const pageNum = Number(querys?.page) || 1;
        const limitNum = Number(querys?.limit) || 10;
        if (pageNum < 1 || limitNum < 1) return manageError({ code: "invalid_params" as never });

        const skip = (pageNum - 1) * limitNum;
        const [data, total] = await Promise.all([
            ticketModel.find().sort({ createdAt: -1 }).skip(skip).limit(limitNum).populate("requester", "name email").populate("assignedTo", "name email").lean(),
            ticketModel.countDocuments()
        ]);

        return { data, meta: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum } };
    },
    getTicketById: async ({ params, manageError }: ManageRequestBody) => {
        const ticketID = params?.id as string;
        if (!ticketID) return manageError({ code: "invalid_params" as never });

        const ticket = await ticketModel.findById(ticketID).populate("requester", "name email").populate("assignedTo", "name email").lean();
        if (!ticket) return manageError({ code: "data_not_found" as never });

        return ticket;
    },
    getDashboardMetrics: async () => {
        const [total, statusData, priorityData] = await Promise.all([
            ticketModel.countDocuments(),
            ticketModel.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
            ticketModel.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }])
        ]);

        const byStatus = statusData.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {});
        const byPriority = priorityData.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {});

        return { total, byStatus, byPriority };
    }
};

export default ticketResource;