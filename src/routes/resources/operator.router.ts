import { Router } from "express";

import operatorResource from "@resources/maintenance/operator.resource";
import manageRequest from "@middlewares/manageRequest";
import hasRole from "@middlewares/hasRole";

const operatorRouter = Router();

operatorRouter.post("/", [hasRole([])], manageRequest(operatorResource.createOperator));
operatorRouter.get("/", [hasRole([])], manageRequest(operatorResource.getAllOperators));
operatorRouter.get("/:id", [hasRole([])], manageRequest(operatorResource.getOperatorById));
operatorRouter.patch("/:id", [hasRole([])], manageRequest(operatorResource.updateOperator));
operatorRouter.delete("/:id", [hasRole([])], manageRequest(operatorResource.deleteOperator));

export default operatorRouter;