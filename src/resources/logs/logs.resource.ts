import { Types } from "mongoose";

import dateService from "@utils/services/date.service";
import { hasUser } from "@database/functions/user";
import userModel from "@database/model/user";
import logModel from "@database/model/log";

import type { ManageRequestBody } from "@middlewares/manageRequest";

const logsResource = {
    getUserLogs: async ({ manageError, ids, querys }: ManageRequestBody) => {
        try {
            const { userID } = ids;
            if (!userID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            const pageNum = Number(querys.page) || 1;
            const limitNum = Number(querys.limit) || 20;
            const action = querys.action;
            const startDate = querys.startDate ? new Date(querys.startDate as string) : undefined;
            const endDate = querys.endDate ? new Date(querys.endDate as string) : undefined;

            if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
                return manageError({ code: "invalid_params" });
            }

            const skip = (pageNum - 1) * limitNum;

            const filter: any = { userID };

            if (action) {
                filter.action = action;
            }

            if (startDate || endDate) {
                filter.timestamp = {};
                if (startDate) filter.timestamp.$gte = startDate;
                if (endDate) filter.timestamp.$lte = endDate;
            }

            const [logs, total] = await Promise.all([
                logModel
                    .find(filter)
                    .sort({ timestamp: -1 })
                    .skip(skip)
                    .limit(limitNum)
                    .lean(),
                logModel.countDocuments(filter)
            ]);

            return {
                logs,
                meta: {
                    total,
                    page: pageNum,
                    pages: Math.ceil(total / limitNum),
                    limit: limitNum
                }
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },

    getEntityLogs: async ({ manageError, ids, params, querys }: ManageRequestBody) => {
        try {
            const { userID } = ids;
            const { entityID } = params;

            if (!userID || !entityID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            const pageNum = Number(querys.page) || 1;
            const limitNum = Number(querys.limit) || 20;
            const action = querys.action;
            const startDate = querys.startDate ? new Date(querys.startDate as string) : undefined;
            const endDate = querys.endDate ? new Date(querys.endDate as string) : undefined;

            if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
                return manageError({ code: "invalid_params" });
            }

            const skip = (pageNum - 1) * limitNum;

            const filter: any = { entityID };

            if (user.role !== "admin") {
                filter.userID = userID;
            }

            if (action) {
                filter.action = action;
            }

            if (startDate || endDate) {
                filter.timestamp = {};
                if (startDate) filter.timestamp.$gte = startDate;
                if (endDate) filter.timestamp.$lte = endDate;
            }

            const [logs, total] = await Promise.all([
                logModel
                    .find(filter)
                    .sort({ timestamp: -1 })
                    .skip(skip)
                    .limit(limitNum)
                    .populate("userID", "name email")
                    .lean(),
                logModel.countDocuments(filter)
            ]);

            return {
                logs,
                meta: {
                    total,
                    page: pageNum,
                    pages: Math.ceil(total / limitNum),
                    limit: limitNum
                }
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },

    getActionLogs: async ({ manageError, params, querys }: ManageRequestBody) => {
        try {
            const { action } = params;

            if (!action) return manageError({ code: "invalid_params" });

            const pageNum = Number(querys.page) || 1;
            const limitNum = Number(querys.limit) || 20;
            const startDate = querys.startDate ? new Date(querys.startDate as string) : undefined;
            const endDate = querys.endDate ? new Date(querys.endDate as string) : undefined;
            const entity = querys.entity;

            if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
                return manageError({ code: "invalid_params" });
            }

            const skip = (pageNum - 1) * limitNum;

            const filter: any = { action };

            if (entity) {
                filter.entity = entity;
            }

            if (startDate || endDate) {
                filter.timestamp = {};
                if (startDate) filter.timestamp.$gte = startDate;
                if (endDate) filter.timestamp.$lte = endDate;
            }

            const [logs, total] = await Promise.all([
                logModel
                    .find(filter)
                    .sort({ timestamp: -1 })
                    .skip(skip)
                    .limit(limitNum)
                    .populate("userID", "name email")
                    .lean(),
                logModel.countDocuments(filter)
            ]);

            return {
                logs,
                meta: {
                    total,
                    page: pageNum,
                    pages: Math.ceil(total / limitNum),
                    limit: limitNum
                }
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },

    getAllLogs: async ({ manageError, querys }: ManageRequestBody) => {
        try {
            const pageNum = Number(querys.page) || 1;
            const limitNum = Number(querys.limit) || 20;
            const action = querys.action;
            const entity = querys.entity;
            const userID = querys.userID;
            const startDate = querys.startDate ? new Date(querys.startDate as string) : undefined;
            const endDate = querys.endDate ? new Date(querys.endDate as string) : undefined;

            if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
                return manageError({ code: "invalid_params" });
            }

            const skip = (pageNum - 1) * limitNum;

            const filter: any = {};

            if (action) filter.action = action;
            if (entity) filter.entity = entity;
            if (userID) filter.userID = userID;

            if (startDate || endDate) {
                filter.timestamp = {};
                if (startDate) filter.timestamp.$gte = startDate;
                if (endDate) filter.timestamp.$lte = endDate;
            }

            const [logs, total] = await Promise.all([
                logModel
                    .find(filter)
                    .sort({ timestamp: -1 })
                    .skip(skip)
                    .limit(limitNum)
                    .populate("userID", "name email role")
                    .lean(),
                logModel.countDocuments(filter)
            ]);

            return {
                logs,
                meta: {
                    total,
                    page: pageNum,
                    pages: Math.ceil(total / limitNum),
                    limit: limitNum
                },
                filters: {
                    action,
                    entity,
                    userID,
                    startDate: startDate?.toISOString(),
                    endDate: endDate?.toISOString()
                }
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },

    getLogStats: async ({ querys, manageError }: ManageRequestBody) => {
        try {
            const startDate = querys.startDate ? new Date(querys.startDate as string) : undefined;
            const endDate = querys.endDate ? new Date(querys.endDate as string) : undefined;

            const dateFilter: any = {};
            if (startDate || endDate) {
                dateFilter.timestamp = {};
                if (startDate) dateFilter.timestamp.$gte = startDate;
                if (endDate) dateFilter.timestamp.$lte = endDate;
            }

            const [
                totalStats,
                byAction,
                byEntity,
                byUser,
                timeline,
                topUsers
            ] = await Promise.all([
                logModel.aggregate([
                    { $match: dateFilter },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: 1 },
                            systemActions: {
                                $sum: { $cond: [{ $eq: ["$action", "system_action"] }, 1, 0] }
                            },
                            userSignups: {
                                $sum: { $cond: [{ $eq: ["$action", "user_signup"] }, 1, 0] }
                            },
                            userSignins: {
                                $sum: { $cond: [{ $eq: ["$action", "user_signin"] }, 1, 0] }
                            },
                            userUpdates: {
                                $sum: { $cond: [{ $eq: ["$action", "user_updated"] }, 1, 0] }
                            },
                            userDeletes: {
                                $sum: { $cond: [{ $eq: ["$action", "user_deleted"] }, 1, 0] }
                            }
                        }
                    }
                ]),

                logModel.aggregate([
                    { $match: dateFilter },
                    {
                        $group: {
                            _id: "$action",
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { count: -1 } }
                ]),

                logModel.aggregate([
                    { $match: dateFilter },
                    {
                        $group: {
                            _id: "$entity",
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { count: -1 } }
                ]),

                logModel.aggregate([
                    { $match: { ...dateFilter, userID: { $exists: true } } },
                    {
                        $group: {
                            _id: "$userID",
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { count: -1 } },
                    { $limit: 10 },
                    {
                        $lookup: {
                            from: "users",
                            localField: "_id",
                            foreignField: "_id",
                            as: "user"
                        }
                    },
                    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                    {
                        $project: {
                            _id: 1,
                            count: 1,
                            userName: "$user.name",
                            userEmail: "$user.email",
                            userRole: "$user.role"
                        }
                    }
                ]),

                logModel.aggregate([
                    { $match: dateFilter },
                    {
                        $group: {
                            _id: {
                                year: { $year: "$timestamp" },
                                month: { $month: "$timestamp" },
                                day: { $dayOfMonth: "$timestamp" }
                            },
                            count: { $sum: 1 },
                            systemActions: {
                                $sum: { $cond: [{ $eq: ["$action", "system_action"] }, 1, 0] }
                            },
                            userActions: {
                                $sum: { $cond: [{ $ne: ["$action", "system_action"] }, 1, 0] }
                            }
                        }
                    },
                    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
                    { $limit: 365 }
                ]),

                logModel.aggregate([
                    { $match: { ...dateFilter, userID: { $exists: true } } },
                    {
                        $group: {
                            _id: "$userID",
                            totalActions: { $sum: 1 },
                            lastAction: { $max: "$timestamp" },
                            firstAction: { $min: "$timestamp" }
                        }
                    },
                    { $sort: { totalActions: -1 } },
                    { $limit: 10 },
                    {
                        $lookup: {
                            from: "users",
                            localField: "_id",
                            foreignField: "_id",
                            as: "user"
                        }
                    },
                    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                    {
                        $project: {
                            _id: 1,
                            totalActions: 1,
                            lastAction: 1,
                            firstAction: 1,
                            userName: "$user.name",
                            userEmail: "$user.email",
                            userRole: "$user.role"
                        }
                    }
                ])
            ]);

            const total = totalStats[0] || {
                total: 0,
                systemActions: 0,
                userSignups: 0,
                userSignins: 0,
                userUpdates: 0,
                userDeletes: 0
            };

            const timelineFormatted = timeline.map(item => ({
                date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
                count: item.count,
                systemActions: item.systemActions,
                userActions: item.userActions
            }));

            return {
                period: {
                    startDate: startDate?.toISOString(),
                    endDate: endDate?.toISOString()
                },
                overview: {
                    totalLogs: total.total,
                    systemActions: total.systemActions,
                    userSignups: total.userSignups,
                    userSignins: total.userSignins,
                    userUpdates: total.userUpdates,
                    userDeletes: total.userDeletes
                },
                byAction: byAction.map(item => ({
                    action: item._id,
                    count: item.count,
                    percentage: total.total > 0 
                        ? `${((item.count / total.total) * 100).toFixed(2)}%`
                        : "0.00%"
                })),
                byEntity: byEntity.map(item => ({
                    entity: item._id,
                    count: item.count,
                    percentage: total.total > 0 
                        ? `${((item.count / total.total) * 100).toFixed(2)}%`
                        : "0.00%"
                })),
                byUser: byUser.map(item => ({
                    userId: item._id,
                    userName: item.userName,
                    userEmail: item.userEmail,
                    userRole: item.userRole,
                    count: item.count
                })),
                timeline: timelineFormatted,
                topUsers: topUsers.map(item => ({
                    userId: item._id,
                    userName: item.userName,
                    userEmail: item.userEmail,
                    userRole: item.userRole,
                    totalActions: item.totalActions,
                    lastAction: item.lastAction,
                    firstAction: item.firstAction
                }))
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },

    getSystemActivity: async ({ querys, manageError }: ManageRequestBody) => {
        try {
            const hours = Number(querys.hours) || 24;

            if (hours < 1 || hours > 168) {
                return manageError({ code: "invalid_params" });
            }

            const startDate = dateService.addHours(dateService.now(), -hours);

            const [
                recentLogs,
                activityByHour,
                activityByAction,
                activeUsers,
                systemErrors
            ] = await Promise.all([
                logModel
                    .find({ timestamp: { $gte: startDate } })
                    .sort({ timestamp: -1 })
                    .limit(50)
                    .populate("userID", "name email role")
                    .lean(),

                logModel.aggregate([
                    { $match: { timestamp: { $gte: startDate } } },
                    {
                        $group: {
                            _id: {
                                year: { $year: "$timestamp" },
                                month: { $month: "$timestamp" },
                                day: { $dayOfMonth: "$timestamp" },
                                hour: { $hour: "$timestamp" }
                            },
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.hour": 1 } }
                ]),

                logModel.aggregate([
                    { $match: { timestamp: { $gte: startDate } } },
                    {
                        $group: {
                            _id: "$action",
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { count: -1 } }
                ]),

                logModel.aggregate([
                    { 
                        $match: { 
                            timestamp: { $gte: startDate },
                            userID: { $exists: true }
                        } 
                    },
                    {
                        $group: {
                            _id: "$userID",
                            lastAction: { $max: "$timestamp" },
                            actionCount: { $sum: 1 }
                        }
                    },
                    { $sort: { lastAction: -1 } },
                    { $limit: 20 },
                    {
                        $lookup: {
                            from: "users",
                            localField: "_id",
                            foreignField: "_id",
                            as: "user"
                        }
                    },
                    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                    {
                        $project: {
                            _id: 1,
                            lastAction: 1,
                            actionCount: 1,
                            userName: "$user.name",
                            userEmail: "$user.email"
                        }
                    }
                ]),

                logModel
                    .find({ 
                        timestamp: { $gte: startDate },
                        action: "system_action",
                        "payload.description": { $regex: /erro|falha|error|failed/i }
                    })
                    .sort({ timestamp: -1 })
                    .limit(20)
                    .populate("userID", "name email")
                    .lean()
            ]);

            const activityByHourFormatted = activityByHour.map(item => ({
                datetime: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')} ${String(item._id.hour).padStart(2, '0')}:00`,
                count: item.count
            }));

            return {
                period: {
                    hours,
                    startDate: startDate.toISOString(),
                    endDate: dateService.now().toISOString()
                },
                recentActivity: recentLogs,
                activityByHour: activityByHourFormatted,
                activityByAction: activityByAction.map(item => ({
                    action: item._id,
                    count: item.count
                })),
                activeUsers: activeUsers.map(item => ({
                    userId: item._id,
                    userName: item.userName,
                    userEmail: item.userEmail,
                    lastAction: item.lastAction,
                    actionCount: item.actionCount
                })),
                systemErrors: systemErrors,
                summary: {
                    totalActivities: recentLogs.length,
                    uniqueUsers: activeUsers.length,
                    totalErrors: systemErrors.length,
                    avgActivitiesPerHour: activityByHour.length > 0 
                        ? Math.round(activityByHour.reduce((sum, item) => sum + item.count, 0) / activityByHour.length)
                        : 0
                }
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },

    getErrorLogs: async ({ querys, manageError }: ManageRequestBody) => {
        try {
            const pageNum = Number(querys.page) || 1;
            const limitNum = Number(querys.limit) || 20;
            const startDate = querys.startDate ? new Date(querys.startDate as string) : undefined;
            const endDate = querys.endDate ? new Date(querys.endDate as string) : undefined;

            if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
                return manageError({ code: "invalid_params" });
            }

            const skip = (pageNum - 1) * limitNum;

            const filter: any = {
                action: "system_action",
                "payload.description": { $regex: /erro|falha|error|failed/i }
            };

            if (startDate || endDate) {
                filter.timestamp = {};
                if (startDate) filter.timestamp.$gte = startDate;
                if (endDate) filter.timestamp.$lte = endDate;
            }

            const [logs, total] = await Promise.all([
                logModel
                    .find(filter)
                    .sort({ timestamp: -1 })
                    .skip(skip)
                    .limit(limitNum)
                    .populate("userID", "name email")
                    .lean(),
                logModel.countDocuments(filter)
            ]);

            return {
                logs,
                meta: {
                    total,
                    page: pageNum,
                    pages: Math.ceil(total / limitNum),
                    limit: limitNum
                }
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    }
};

export default logsResource;