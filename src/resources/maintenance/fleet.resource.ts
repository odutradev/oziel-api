import fleetModel from "@database/model/fleet";
import dateService from "@utils/services/date.service";

import type { ManageRequestBody } from "@middlewares/manageRequest";

type FleetPayload = {
    name: string;
    description?: string;
    active?: boolean;
};

const fleetResource = {
    createFleet: async ({ data, createLog, ids, manageError }: ManageRequestBody) => {
        const payload = data as FleetPayload;
        if (!payload.name) return manageError({ code: "invalid_params" as never });

        const fleet = await fleetModel.create({ ...payload, active: payload.active ?? true });
        await createLog({ action: "system_action", entity: "system", entityID: fleet._id.toString(), userID: ids.userID, data: { description: "Fleet created", fleet } });

        return fleet;
    },
    updateFleet: async ({ params, data, createLog, ids, manageError }: ManageRequestBody) => {
        const fleetID = params?.id as string;
        if (!fleetID) return manageError({ code: "invalid_params" as never });

        const payload = data as Partial<FleetPayload>;
        const updatedFleet = await fleetModel.findByIdAndUpdate(fleetID, { ...payload, updatedAt: dateService.now() }, { new: true });
        if (!updatedFleet) return manageError({ code: "data_not_found" as never });

        await createLog({ action: "system_action", entity: "system", entityID: fleetID, userID: ids.userID, data: { description: "Fleet updated", data } });

        return updatedFleet;
    },
    deleteFleet: async ({ params, createLog, ids, manageError }: ManageRequestBody) => {
        const fleetID = params?.id as string;
        if (!fleetID) return manageError({ code: "invalid_params" as never });

        const deletedFleet = await fleetModel.findByIdAndDelete(fleetID);
        if (!deletedFleet) return manageError({ code: "data_not_found" as never });

        await createLog({ action: "system_action", entity: "system", entityID: fleetID, userID: ids.userID, data: { description: "Fleet deleted" } });

        return { success: true };
    },
    getAllFleets: async ({ querys, manageError }: ManageRequestBody) => {
        const pageNum = Number(querys?.page) || 1;
        const limitNum = Number(querys?.limit) || 10;
        if (pageNum < 1 || limitNum < 1) return manageError({ code: "invalid_params" as never });

        const skip = (pageNum - 1) * limitNum;
        const [data, total] = await Promise.all([
            fleetModel.find().sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
            fleetModel.countDocuments()
        ]);

        return { data, meta: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum } };
    },
    getFleetById: async ({ params, manageError }: ManageRequestBody) => {
        const fleetID = params?.id as string;
        if (!fleetID) return manageError({ code: "invalid_params" as never });

        const fleet = await fleetModel.findById(fleetID).lean();
        if (!fleet) return manageError({ code: "data_not_found" as never });

        return fleet;
    }
};

export default fleetResource;