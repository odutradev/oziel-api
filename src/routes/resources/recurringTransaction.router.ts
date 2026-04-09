import { Router } from "express";

import recurringTransactionResource from "@resources/treasury/recurringTransaction.resource";
import manageRequest from "@middlewares/manageRequest";
import hasRole from "@middlewares/hasRole";

const recurringTransactionRouter = Router();

recurringTransactionRouter.post("/", [hasRole([])], manageRequest(recurringTransactionResource.createRecurringTransaction));
recurringTransactionRouter.get("/", [hasRole([])], manageRequest(recurringTransactionResource.getAllRecurringTransactions));
recurringTransactionRouter.patch("/:transactionID", [hasRole([])], manageRequest(recurringTransactionResource.updateRecurringTransaction));
recurringTransactionRouter.delete("/:transactionID", [hasRole([])], manageRequest(recurringTransactionResource.deleteRecurringTransaction));

export default recurringTransactionRouter;