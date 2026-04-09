import { Router } from "express";

import logsResource from "@resources/logs/logs.resource";
import manageRequest from "@middlewares/manageRequest";
import hasRole from "@middlewares/hasRole";

const logsRouter = Router();

logsRouter.get("/users/me/activity", manageRequest(logsResource.getUserLogs));
logsRouter.get("/entities/:entityID/history", manageRequest(logsResource.getEntityLogs));
logsRouter.get("/actions/:actionName/records", [hasRole([])], manageRequest(logsResource.getActionLogs));

logsRouter.get("/system/activity-overview", [hasRole([])], manageRequest(logsResource.getSystemActivity));
logsRouter.get("/system/error-reports", [hasRole([])], manageRequest(logsResource.getErrorLogs));
logsRouter.get("/system/statistics", [hasRole([])], manageRequest(logsResource.getLogStats));
logsRouter.get("/system/all-records", [hasRole([])], manageRequest(logsResource.getAllLogs));

export default logsRouter;