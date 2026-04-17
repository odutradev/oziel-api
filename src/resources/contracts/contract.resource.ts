import dateService from "@utils/services/date.service";
import contractModel from "@database/model/contract";

import type { ContractModelType } from "@utils/types/models/contract";
import type { ManageRequestBody } from "@middlewares/manageRequest";

const contractResource = {
    createContract: async ({ data, createLog, ids, manageError }: ManageRequestBody) => {
        const payload = data as Partial<ContractModelType>;
        if (!payload.code || !payload.type || !payload.contractDate || typeof payload.totalValue !== "number" || typeof payload.totalSalePrice !== "number") return manageError({ code: "invalid_params" as never });

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
    getDashboardMetrics: async ({ querys }: ManageRequestBody) => {
        const matchStage: Record<string, unknown> = {};

        if (querys?.startDate && querys?.endDate) {
            matchStage.contractDate = {
                $gte: new Date(querys.startDate as string),
                $lte: new Date(querys.endDate as string)
            };
        }

        const [aggregationResult, recentContracts] = await Promise.all([
            contractModel.aggregate([
                { $match: matchStage },
                {
                    $facet: {
                        overall: [
                            {
                                $group: {
                                    _id: null,
                                    totalContracts: { $sum: 1 },
                                    totalValue: { $sum: "$totalValue" },
                                    totalSalePrice: { $sum: "$totalSalePrice" }
                                }
                            }
                        ],
                        byStatus: [
                            {
                                $group: {
                                    _id: "$status",
                                    count: { $sum: 1 },
                                    value: { $sum: "$totalValue" }
                                }
                            }
                        ],
                        byType: [
                            {
                                $group: {
                                    _id: "$type",
                                    count: { $sum: 1 },
                                    value: { $sum: "$totalValue" }
                                }
                            }
                        ]
                    }
                }
            ]),
            contractModel.find(matchStage).sort({ contractDate: -1 }).limit(10).lean()
        ]);

        const metrics = aggregationResult[0] ?? {};
        const overall = metrics.overall?.[0] ?? { totalContracts: 0, totalValue: 0, totalSalePrice: 0 };
        const byStatus = metrics.byStatus ?? [];
        const byType = metrics.byType ?? [];

        const profit = overall.totalSalePrice - overall.totalValue;
        const profitMargin = overall.totalSalePrice > 0 ? (profit / overall.totalSalePrice) * 100 : 0;

        const formattedStatus = byStatus.map((item: { _id: string; count: number; value: number }) => ({
            status: item._id,
            count: item.count,
            value: item.value
        }));

        const formattedType = byType.map((item: { _id: string; count: number; value: number }) => ({
            type: item._id,
            count: item.count,
            value: item.value
        }));

        return {
            summary: {
                totalContracts: overall.totalContracts,
                totalValue: overall.totalValue,
                totalSalePrice: overall.totalSalePrice,
                expectedProfit: profit,
                profitMarginPercentage: Number(profitMargin.toFixed(2))
            },
            distribution: {
                byStatus: formattedStatus,
                byType: formattedType
            },
            recentContracts
        };
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