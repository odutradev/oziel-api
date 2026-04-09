import { Router } from "express";

import recurringTransactionRouter from "./resources/recurringTransaction.router";
import machineOperationRouter from "./resources/machineOperation.router";
import controlAccess from "@middlewares/controlAccess";
import treasuryRouter from "./resources/treasury.router";
import emailsRouter from "./resources/emails.router";
import usersRouter from "./resources/users.router";
import vaultRouter from "./resources/vault.router";
import logsRouter from "./resources/logs.router";
import auth from "@middlewares/auth";

const router = Router();

router.get("/health-check/ping", (req, res) => {
    res.sendStatus(200);
});

router.get("/system/validate-access", controlAccess, (req, res) => {
    res.sendStatus(200);
});

router.use("/users", [controlAccess], usersRouter);
router.use("/maintenance/machine-operations", [auth, controlAccess], machineOperationRouter);
router.use("/treasury/recurring-transactions", [auth, controlAccess], recurringTransactionRouter);
router.use("/treasury/transactions", [auth, controlAccess], treasuryRouter);
router.use("/treasury/vaults", [auth, controlAccess], vaultRouter);
router.use("/communications/emails", [auth, controlAccess], emailsRouter);
router.use("/system/logs", [auth, controlAccess], logsRouter);

export default router;