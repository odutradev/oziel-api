import { Router } from "express";

import recurringTransactionRouter from "./resources/recurringTransaction.router";
import machineOperationRouter from "./resources/machineOperation.router";
import treasuryRouter from "./resources/treasury.router";
import controlAccess from "@middlewares/controlAccess";
import usersRouter from "./resources/users.router";
import vaultRouter from "./resources/vault.router";
import emailsRouter from "./resources/emails.router";
import logsRouter from "./resources/logs.router";
import auth from "@middlewares/auth";

const router = Router();

router.get("/ping", (req, res) => {
    res.sendStatus(200);
});

router.get("/validate/control-access", controlAccess, (req, res) => {
    res.sendStatus(200);
});

router.use("/users", [controlAccess], usersRouter);

router.use("/maintenance/operations", [auth, controlAccess], machineOperationRouter);
router.use("/recurring-transactions", [auth, controlAccess], recurringTransactionRouter);
router.use("/treasury", [auth, controlAccess], treasuryRouter);
router.use("/vaults", [auth, controlAccess], vaultRouter);
router.use("/emails", [auth, controlAccess], emailsRouter);
router.use("/logs", [auth, controlAccess], logsRouter);

export default router;