import { Router } from "express";

import productionResource from "@resources/agriculture/production.resource";
import manageRequest from "@middlewares/manageRequest";
import hasRole from "@middlewares/hasRole";

const productionRouter = Router();

productionRouter.post("/", [hasRole([])], manageRequest(productionResource.createProduction));
productionRouter.get("/", [hasRole([])], manageRequest(productionResource.getAllProductions));
productionRouter.get("/:id", [hasRole([])], manageRequest(productionResource.getProductionById));
productionRouter.patch("/:id", [hasRole([])], manageRequest(productionResource.updateProduction));
productionRouter.delete("/:id", [hasRole([])], manageRequest(productionResource.deleteProduction));

export default productionRouter;