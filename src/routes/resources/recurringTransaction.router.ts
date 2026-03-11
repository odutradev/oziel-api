import { Router } from "express";

import recurringTransactionResource from "@resources/treasury/recurringTransaction.resource";
import manageRequest from "@middlewares/manageRequest";
import hasRole from "@middlewares/hasRole";

const recurringTransactionRouter = Router();

recurringTransactionRouter.get("/", [hasRole([])], manageRequest(recurringTransactionResource.getAllRecurringTransactions));
recurringTransactionRouter.delete("/:id", [hasRole([])], manageRequest(recurringTransactionResource.deleteRecurringTransaction));
recurringTransactionRouter.patch("/:id", [hasRole([])], manageRequest(recurringTransactionResource.updateRecurringTransaction));
recurringTransactionRouter.post("/", [hasRole([])], manageRequest(recurringTransactionResource.createRecurringTransaction));

export default recurringTransactionRouter;