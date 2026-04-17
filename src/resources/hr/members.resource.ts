import validationService from "@utils/services/validation.service";
import stringService from "@utils/services/string.services";
import dateService from "@utils/services/date.service";
import userModel from "@database/model/user";

import type { ManageRequestBody } from "@middlewares/manageRequest";
import type { UserModelType } from "@utils/types/models/user";

const membersResource = {
    createMember: async ({ data, createLog, ids, manageError }: ManageRequestBody) => {
        const payload = data as Partial<UserModelType>;
        if (!payload.name || !payload.cpfOrRg) return manageError({ code: "invalid_params" as never });

        const cleanCpfOrRg = payload.cpfOrRg.trim();
        if (!validationService.validateCPForRG(cleanCpfOrRg)) return manageError({ code: "author_invalid_cpf_rg" as never });

        const existingMember = await userModel.findOne({ cpfOrRg: cleanCpfOrRg });
        if (existingMember) return manageError({ code: "user_already_exists" as never });

        if (payload.email) {
            const existingEmail = await userModel.findOne({ email: payload.email });
            if (existingEmail) return manageError({ code: "user_already_exists" as never });
        }

        const newMember = await userModel.create({
            ...payload,
            name: stringService.normalizeString(payload.name),
            cpfOrRg: cleanCpfOrRg,
            hrControl: {
                ...payload.hrControl,
                isMonitored: true
            },
            role: "normal",
            status: payload.status || "registered"
        });

        await createLog({ action: "system_action", entity: "user", entityID: newMember._id.toString(), userID: ids.userID, data: { newMember } });

        return newMember;
    },
    updateMember: async ({ params, data, createLog, ids, manageError }: ManageRequestBody) => {
        const memberID = params?.id as string;
        if (!memberID) return manageError({ code: "invalid_params" as never });

        const payload = data as Partial<UserModelType>;

        if (payload.cpfOrRg) {
            const cleanCpfOrRg = payload.cpfOrRg.trim();
            if (!validationService.validateCPForRG(cleanCpfOrRg)) return manageError({ code: "author_invalid_cpf_rg" as never });
            payload.cpfOrRg = cleanCpfOrRg;
        }

        if (payload.name) payload.name = stringService.normalizeString(payload.name);

        const updateData: Record<string, unknown> = { ...payload, lastUpdate: dateService.now() };

        if (payload.hrControl) {
            if (payload.hrControl.familyMembers !== undefined) updateData["hrControl.familyMembers"] = payload.hrControl.familyMembers;
            if (payload.hrControl.address !== undefined) updateData["hrControl.address"] = payload.hrControl.address;
            if (payload.hrControl.phone !== undefined) updateData["hrControl.phone"] = payload.hrControl.phone;
            delete updateData.hrControl;
        }

        const updatedMember = await userModel.findOneAndUpdate(
            { _id: memberID, "hrControl.isMonitored": true },
            { $set: updateData },
            { new: true }
        ).select("-password");

        if (!updatedMember) return manageError({ code: "data_not_found" as never });

        await createLog({ action: "system_action", entity: "user", entityID: memberID, userID: ids.userID, data: { data } });

        return updatedMember;
    },
    deleteMember: async ({ params, createLog, ids, manageError }: ManageRequestBody) => {
        const memberID = params?.id as string;
        if (!memberID) return manageError({ code: "invalid_params" as never });

        const deletedMember = await userModel.findOneAndDelete({ _id: memberID, "hrControl.isMonitored": true });
        if (!deletedMember) return manageError({ code: "data_not_found" as never });

        await createLog({ action: "system_action", entity: "user", entityID: memberID, userID: ids.userID, data: { deletedMember } });

        return { success: true };
    },
    getAllMembers: async ({ querys, manageError }: ManageRequestBody) => {
        const pageNum = Number(querys?.page) || 1;
        const limitNum = Number(querys?.limit) || 10;
        if (pageNum < 1 || limitNum < 1) return manageError({ code: "invalid_params" as never });

        const skip = (pageNum - 1) * limitNum;
        const [data, total] = await Promise.all([
            userModel.find({ "hrControl.isMonitored": true }).sort({ createAt: -1 }).skip(skip).limit(limitNum).select("-password").lean(),
            userModel.countDocuments({ "hrControl.isMonitored": true })
        ]);

        return { data, meta: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum } };
    },
    getMemberById: async ({ params, manageError }: ManageRequestBody) => {
        const memberID = params?.id as string;
        if (!memberID) return manageError({ code: "invalid_params" as never });

        const member = await userModel.findOne({ _id: memberID, "hrControl.isMonitored": true }).select("-password").lean();
        if (!member) return manageError({ code: "data_not_found" as never });

        return member;
    },
    getDashboardMetrics: async () => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [totalMembers, byStatus, familyMembersAggregation, newThisMonth] = await Promise.all([
            userModel.countDocuments({ "hrControl.isMonitored": true }),
            userModel.aggregate([
                { $match: { "hrControl.isMonitored": true } },
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]),
            userModel.aggregate([
                { $match: { "hrControl.isMonitored": true } },
                { $group: { _id: null, totalFamily: { $sum: "$hrControl.familyMembers" } } }
            ]),
            userModel.countDocuments({ "hrControl.isMonitored": true, createAt: { $gte: startOfMonth } })
        ]);

        const statusDistribution = byStatus.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {} as Record<string, number>);
        const totalFamilyMembers = familyMembersAggregation[0]?.totalFamily ?? 0;

        return {
            totalMembers,
            totalFamilyMembers,
            newThisMonth,
            statusDistribution
        };
    }
};

export default membersResource;