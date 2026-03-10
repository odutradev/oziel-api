import { Router } from "express";

import treasuryResource from "@resources/treasury/treasury.resource";
import manageRequest from "@middlewares/manageRequest";
import hasRole from "@middlewares/hasRole";
import auth from "@middlewares/auth";

const treasuryRouter = Router();

treasuryRouter.get("/summary", [auth, hasRole([])], manageRequest(treasuryResource.getMonthlySummary));
treasuryRouter.post("/transaction", [auth, hasRole([])], manageRequest(treasuryResource.addTransaction));
treasuryRouter.post("/close-month", [auth, hasRole([])], manageRequest(treasuryResource.closeMonth));

export default treasuryRouter;