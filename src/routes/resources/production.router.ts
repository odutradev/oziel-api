import { Router } from "express";

import productionResource from "@resources/agriculture/production.resource";
import manageRequest from "@middlewares/manageRequest";

const productionRouter = Router();

productionRouter.post("/", manageRequest(productionResource.createProduction));
productionRouter.get("/", manageRequest(productionResource.getAllProductions));
productionRouter.get("/:id", manageRequest(productionResource.getProductionById));
productionRouter.patch("/:id", manageRequest(productionResource.updateProduction));
productionRouter.delete("/:id", manageRequest(productionResource.deleteProduction));

export default productionRouter;