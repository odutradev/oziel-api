import { Router } from "express";

import assetResource from "@resources/maintenance/asset.resource";
import manageRequest from "@middlewares/manageRequest";

const assetRouter = Router();

assetRouter.post("/", manageRequest(assetResource.createAsset));
assetRouter.get("/", manageRequest(assetResource.getAllAssets));
assetRouter.get("/:id", manageRequest(assetResource.getAssetById));
assetRouter.patch("/:id", manageRequest(assetResource.updateAsset));
assetRouter.delete("/:id", manageRequest(assetResource.deleteAsset));

export default assetRouter;