import { Router } from "express";

import productResource from "@resources/agriculture/product.resource";
import manageRequest from "@middlewares/manageRequest";
import hasRole from "@middlewares/hasRole";

const productRouter = Router();

productRouter.post("/", [hasRole([])], manageRequest(productResource.createProduct));
productRouter.get("/", [hasRole([])], manageRequest(productResource.getAllProducts));
productRouter.get("/:id", [hasRole([])], manageRequest(productResource.getProductById));
productRouter.patch("/:id", [hasRole([])], manageRequest(productResource.updateProduct));
productRouter.delete("/:id", [hasRole([])], manageRequest(productResource.deleteProduct));

export default productRouter;