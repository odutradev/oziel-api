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
        const isSuperUser = SUPER_ROLES.includes(role);
        const hasPermission = allowedRoles.includes(role);
        
        if (!isSuperUser && !hasPermission) {
            sendError({ code: "admin_access_denied", res });
            return;
        }

        next();
    } catch (error) {
        logger.error("[hasRole] Role validation internal error");
        console.log(error);
        sendError({ code: "internal_error", res });
        return;
    }
};

export default hasRole;
