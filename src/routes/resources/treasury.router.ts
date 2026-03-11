import { Router } from "express";

import treasuryResource from "@resources/treasury/treasury.resource";
import manageRequest from "@middlewares/manageRequest";
import hasRole from "@middlewares/hasRole";

const treasuryRouter = Router();

treasuryRouter.patch("/:transactionID/confirm", [hasRole([])], manageRequest(treasuryResource.confirmTransaction));
treasuryRouter.delete("/:transactionID", [hasRole([])], manageRequest(treasuryResource.deleteTransaction));
treasuryRouter.patch("/:transactionID", [hasRole([])], manageRequest(treasuryResource.updateTransaction));
treasuryRouter.get("/dashboard", [hasRole([])], manageRequest(treasuryResource.getMonthlyDashboard));
treasuryRouter.post("/", [hasRole([])], manageRequest(treasuryResource.createTransaction));

export default treasuryRouter;