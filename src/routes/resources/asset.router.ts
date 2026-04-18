import { Router } from "express";

import assetResource from "@resources/maintenance/asset.resource";
import manageRequest from "@middlewares/manageRequest";
import hasRole from "@middlewares/hasRole";

const assetRouter = Router();

assetRouter.post("/", [hasRole([])], manageRequest(assetResource.createAsset));
assetRouter.get("/", [hasRole([])], manageRequest(assetResource.getAllAssets));
assetRouter.get("/:id", [hasRole([])], manageRequest(assetResource.getAssetById));
assetRouter.patch("/:id", [hasRole([])], manageRequest(assetResource.updateAsset));
assetRouter.delete("/:id", [hasRole([])], manageRequest(assetResource.deleteAsset));

export default assetRouter;