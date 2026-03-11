import { Router } from "express";

import vaultResource from "@resources/treasury/vault.resource";
import manageRequest from "@middlewares/manageRequest";
import hasRole from "@middlewares/hasRole";
import auth from "@middlewares/auth";

const vaultRouter = Router();

vaultRouter.post("/", [auth, hasRole(["admin"])], manageRequest(vaultResource.createVault));
vaultRouter.get("/", [auth, hasRole(["admin", "normal"])], manageRequest(vaultResource.getVaults));
vaultRouter.get("/:id", [auth, hasRole(["admin", "normal"])], manageRequest(vaultResource.getVaultById));
vaultRouter.patch("/:id", [auth, hasRole(["admin"])], manageRequest(vaultResource.updateVault));
vaultRouter.post("/:id/transactions", [auth, hasRole(["admin"])], manageRequest(vaultResource.processTransaction));

export default vaultRouter;