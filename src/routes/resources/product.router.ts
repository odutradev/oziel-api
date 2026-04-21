import { Router } from "express";

import productResource from "@resources/agriculture/product.resource";
import manageRequest from "@middlewares/manageRequest";

const productRouter = Router();

productRouter.post("/", manageRequest(productResource.createProduct));
productRouter.get("/", manageRequest(productResource.getAllProducts));
productRouter.get("/:id", manageRequest(productResource.getProductById));
productRouter.patch("/:id", manageRequest(productResource.updateProduct));
productRouter.delete("/:id", manageRequest(productResource.deleteProduct));

export default productRouter;