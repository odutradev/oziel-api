import { Router } from "express";

import recurringTransactionResource from "@resources/treasury/recurringTransaction.resource";
import manageRequest from "@middlewares/manageRequest";

const recurringTransactionRouter = Router();

recurringTransactionRouter.post("/", manageRequest(recurringTransactionResource.createRecurringTransaction));
recurringTransactionRouter.get("/", manageRequest(recurringTransactionResource.getAllRecurringTransactions));
recurringTransactionRouter.patch("/:transactionID", manageRequest(recurringTransactionResource.updateRecurringTransaction));
recurringTransactionRouter.delete("/:transactionID", manageRequest(recurringTransactionResource.deleteRecurringTransaction));

export default recurringTransactionRouter;