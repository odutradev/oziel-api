import { Router } from "express";

import treasuryResource from "@resources/treasury/treasury.resource";
import manageRequest from "@middlewares/manageRequest";
import hasRole from "@middlewares/hasRole";
import auth from "@middlewares/auth";

const treasuryRouter = Router();

treasuryRouter.patch("/:transactionID/confirm", [auth, hasRole(["admin"])], manageRequest(treasuryResource.confirmTransaction));
treasuryRouter.delete("/:transactionID", [auth, hasRole(["admin"])], manageRequest(treasuryResource.deleteTransaction));
treasuryRouter.patch("/:transactionID", [auth, hasRole(["admin"])], manageRequest(treasuryResource.updateTransaction));
treasuryRouter.get("/dashboard", [auth, hasRole(["admin", "normal"])], manageRequest(treasuryResource.getMonthlyDashboard));
treasuryRouter.post("/", [auth, hasRole(["admin"])], manageRequest(treasuryResource.createTransaction));

export default treasuryRouter;