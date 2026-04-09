import { Router } from "express";

import machineOperationResource from "@resources/maintenance/machineOperation.resource";
import manageRequest from "@middlewares/manageRequest";
import hasRole from "@middlewares/hasRole";

const machineOperationRouter = Router();

machineOperationRouter.patch("/:id/status", [hasRole([])], manageRequest(machineOperationResource.updateOperationStatus));
machineOperationRouter.delete("/:id", [hasRole([])], manageRequest(machineOperationResource.deleteOperation));
machineOperationRouter.patch("/:id", [hasRole([])], manageRequest(machineOperationResource.updateOperation));
machineOperationRouter.get("/:id", [hasRole([])], manageRequest(machineOperationResource.getOperationById));
machineOperationRouter.post("/", [hasRole([])], manageRequest(machineOperationResource.createOperation));
machineOperationRouter.get("/", [hasRole([])], manageRequest(machineOperationResource.getAllOperations));

export default machineOperationRouter;