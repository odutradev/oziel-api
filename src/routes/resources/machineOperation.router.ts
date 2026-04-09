import { Router } from "express";

import machineOperationResource from "@resources/maintenance/machineOperation.resource";
import manageRequest from "@middlewares/manageRequest";
import hasRole from "@middlewares/hasRole";

const machineOperationRouter = Router();

machineOperationRouter.post("/", [hasRole([])], manageRequest(machineOperationResource.createOperation));
machineOperationRouter.get("/", [hasRole([])], manageRequest(machineOperationResource.getAllOperations));
machineOperationRouter.get("/:operationID", [hasRole([])], manageRequest(machineOperationResource.getOperationById));
machineOperationRouter.patch("/:operationID", [hasRole([])], manageRequest(machineOperationResource.updateOperation));
machineOperationRouter.delete("/:operationID", [hasRole([])], manageRequest(machineOperationResource.deleteOperation));
machineOperationRouter.patch("/:operationID/status", [hasRole([])], manageRequest(machineOperationResource.updateOperationStatus));

export default machineOperationRouter;