import { Router } from "express";

import contractResource from "@resources/contracts/contract.resource";
import manageRequest from "@middlewares/manageRequest";

const contractRouter = Router();

contractRouter.post("/", manageRequest(contractResource.createContract));
contractRouter.get("/", manageRequest(contractResource.getAllContracts));
contractRouter.get("/dashboard", manageRequest(contractResource.getDashboardMetrics));
contractRouter.get("/:id", manageRequest(contractResource.getContractById));
contractRouter.patch("/:id", manageRequest(contractResource.updateContract));
contractRouter.delete("/:id", manageRequest(contractResource.deleteContract));

export default contractRouter;