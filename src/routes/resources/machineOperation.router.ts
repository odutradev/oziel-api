import { Router } from "express";

import machineOperationResource from "@resources/maintenance/machineOperation.resource";
import manageRequest from "@middlewares/manageRequest";

const machineOperationRouter = Router();

machineOperationRouter.post("/", manageRequest(machineOperationResource.createOperation));
machineOperationRouter.get("/", manageRequest(machineOperationResource.getAllOperations));
machineOperationRouter.get("/monthly-dashboard", manageRequest(machineOperationResource.getMonthlyDashboard));
machineOperationRouter.get("/monthly-closing", manageRequest(machineOperationResource.getMonthlyClosingReport));
machineOperationRouter.get("/:operationID", manageRequest(machineOperationResource.getOperationById));
machineOperationRouter.patch("/:operationID", manageRequest(machineOperationResource.updateOperation));
machineOperationRouter.delete("/:operationID", manageRequest(machineOperationResource.deleteOperation));
machineOperationRouter.patch("/:operationID/status", manageRequest(machineOperationResource.updateOperationStatus));

export default machineOperationRouter;