import { Router } from "express";

import contractResource from "@resources/contracts/contract.resource";
import manageRequest from "@middlewares/manageRequest";
import hasRole from "@middlewares/hasRole";

const contractRouter = Router();

contractRouter.post("/", [hasRole([])], manageRequest(contractResource.createContract));
contractRouter.get("/", [hasRole([])], manageRequest(contractResource.getAllContracts));
contractRouter.get("/dashboard", [hasRole([])], manageRequest(contractResource.getDashboardMetrics));
contractRouter.get("/:id", [hasRole([])], manageRequest(contractResource.getContractById));
contractRouter.patch("/:id", [hasRole([])], manageRequest(contractResource.updateContract));
contractRouter.delete("/:id", [hasRole([])], manageRequest(contractResource.deleteContract));

export default contractRouter;