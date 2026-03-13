import { Request, Response, NextFunction } from "express";

import { SUPER_ROLES } from "@utils/types/models/user";
import sendError from "@utils/functions/error";
import userModel from "@database/model/user";
import logger from "@utils/functions/logger";

import type { RoleType } from "@utils/types/models/user";

const hasRole = (allowedRoles: RoleType[]) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userID = res.locals?.userID;
        if (!userID) {
            sendError({ code: "invalid_credentials", res });
            return;
        }

        const user = await userModel.findById(userID).select("role");
        if (!user) {
            sendError({ code: "admin_access_denied", res });
            return;
        }

        const role = user.role as RoleType;
        if ((SUPER_ROLES as RoleType[]).includes(role) || allowedRoles.includes(role)) {
            next();
            return;
        }

        sendError({ code: "admin_access_denied", res });
    } catch (error) {
        logger.error("[hasRole] Role validation internal error");
        sendError({ code: "internal_error", res });
    }
};

export default hasRole;