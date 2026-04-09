import { Router } from "express";

import treasuryResource from "@resources/treasury/treasury.resource";
import manageRequest from "@middlewares/manageRequest";
import hasRole from "@middlewares/hasRole";

const treasuryRouter = Router();

treasuryRouter.post("/", [hasRole([])], manageRequest(treasuryResource.createTransaction));
treasuryRouter.get("/monthly-dashboard", [hasRole([])], manageRequest(treasuryResource.getMonthlyDashboard));
treasuryRouter.patch("/:transactionID", [hasRole([])], manageRequest(treasuryResource.updateTransaction));
treasuryRouter.delete("/:transactionID", [hasRole([])], manageRequest(treasuryResource.deleteTransaction));
treasuryRouter.patch("/:transactionID/confirm", [hasRole([])], manageRequest(treasuryResource.confirmTransaction));

export default treasuryRouter;