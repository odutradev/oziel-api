import { Router } from "express";

import vaultResource from "@resources/treasury/vault.resource";
import manageRequest from "@middlewares/manageRequest";
import hasRole from "@middlewares/hasRole";

const vaultRouter = Router();

vaultRouter.post("/", [hasRole([])], manageRequest(vaultResource.createVault));
vaultRouter.get("/", [hasRole([])], manageRequest(vaultResource.getVaults));
vaultRouter.get("/:id", [hasRole([])], manageRequest(vaultResource.getVaultById));
vaultRouter.patch("/:id", [hasRole([])], manageRequest(vaultResource.updateVault));
vaultRouter.post("/:id/transactions", [hasRole([])], manageRequest(vaultResource.processTransaction));

export default vaultRouter;