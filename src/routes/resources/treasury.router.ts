import { Router } from "express";

import treasuryResource from "@resources/treasury/treasury.resource";
import manageRequest from "@middlewares/manageRequest";

const treasuryRouter = Router();

treasuryRouter.post("/", manageRequest(treasuryResource.createTransaction));
treasuryRouter.get("/monthly-dashboard", manageRequest(treasuryResource.getMonthlyDashboard));
treasuryRouter.patch("/:transactionID", manageRequest(treasuryResource.updateTransaction));
treasuryRouter.delete("/:transactionID", manageRequest(treasuryResource.deleteTransaction));
treasuryRouter.patch("/:transactionID/confirm", manageRequest(treasuryResource.confirmTransaction));

export default treasuryRouter;