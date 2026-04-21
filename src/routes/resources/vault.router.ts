import { Router } from "express";

import vaultResource from "@resources/treasury/vault.resource";
import manageRequest from "@middlewares/manageRequest";

const vaultRouter = Router();

vaultRouter.post("/", manageRequest(vaultResource.createVault));
vaultRouter.get("/", manageRequest(vaultResource.getVaults));
vaultRouter.get("/:vaultID", manageRequest(vaultResource.getVaultById));
vaultRouter.patch("/:vaultID", manageRequest(vaultResource.updateVault));
vaultRouter.post("/:vaultID/transactions", manageRequest(vaultResource.processTransaction));

export default vaultRouter;