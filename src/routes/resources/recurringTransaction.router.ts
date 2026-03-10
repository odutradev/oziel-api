import { Router } from "express";

import recurringTransactionResource from "@resources/treasury/recurringTransaction.resource";
import manageRequest from "@middlewares/manageRequest";
import hasRole from "@middlewares/hasRole";
import auth from "@middlewares/auth";

const recurringTransactionRouter = Router();

recurringTransactionRouter.post("/", [auth, hasRole(["admin"])], manageRequest(recurringTransactionResource.createRecurringTransaction));
recurringTransactionRouter.patch("/:id", [auth, hasRole(["admin"])], manageRequest(recurringTransactionResource.updateRecurringTransaction));
recurringTransactionRouter.delete("/:id", [auth, hasRole(["admin"])], manageRequest(recurringTransactionResource.deleteRecurringTransaction));
recurringTransactionRouter.get("/", [auth, hasRole(["admin", "normal"])], manageRequest(recurringTransactionResource.getAllRecurringTransactions));

export default recurringTransactionRouter;