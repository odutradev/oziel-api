import { Router } from "express";

import operatorResource from "@resources/maintenance/operator.resource";
import manageRequest from "@middlewares/manageRequest";

const operatorRouter = Router();

operatorRouter.post("/", manageRequest(operatorResource.createOperator));
operatorRouter.get("/", manageRequest(operatorResource.getAllOperators));
operatorRouter.get("/:id", manageRequest(operatorResource.getOperatorById));
operatorRouter.patch("/:id", manageRequest(operatorResource.updateOperator));
operatorRouter.delete("/:id", manageRequest(operatorResource.deleteOperator));

export default operatorRouter;