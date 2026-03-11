
import { Router } from "express";

import logsResource from "@resources/logs/logs.resource";
import manageRequest from "@middlewares/manageRequest";
import hasRole from "@middlewares/hasRole";

const logsRouter = Router();

logsRouter.get("/user/me", manageRequest(logsResource.getUserLogs));
logsRouter.get("/entity/:entityID", manageRequest(logsResource.getEntityLogs));
logsRouter.get("/action/:action", [hasRole([])], manageRequest(logsResource.getActionLogs));

logsRouter.get("/admin/activity", [hasRole([])], manageRequest(logsResource.getSystemActivity));
logsRouter.get("/admin/errors", [hasRole([])], manageRequest(logsResource.getErrorLogs));
logsRouter.get("/admin/stats", [hasRole([])], manageRequest(logsResource.getLogStats));
logsRouter.get("/admin/all", [hasRole([])], manageRequest(logsResource.getAllLogs));

export default logsRouter;
