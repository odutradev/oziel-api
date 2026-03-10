import { Request, Response, NextFunction } from "express";

import sendError from "@utils/functions/error";
import userModel from "@database/model/user";
import logger from "@utils/functions/logger";

import type { RoleType } from "@utils/constants/roles";

const hasRole = (allowedRoles: RoleType[]) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {  
  try {
    const userID = res.locals?.userID;
    
    if (!userID) {
      return sendError({ code: "invalid_credentials", res });
    }

    const user = await userModel.findById(userID).select("role");
    
    if (!user) {
      return sendError({ code: "admin_access_denied", res });
    }

    const hasPermission = allowedRoles.includes(user.role as RoleType);
    
    if (!hasPermission) {
      return sendError({ code: "admin_access_denied", res });
    }

    return next();
  } catch (error) {
    logger.error("[hasRole] Role validation internal error");
    console.log(error);
    return sendError({ code: "internal_error", res });
  }
};

export default hasRole;