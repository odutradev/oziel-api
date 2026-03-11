import { Router } from "express";

import recurringTransactionRouter from "./resources/recurringTransaction.router";
import treasuryRouter from "./resources/treasury.router";
import controlAccess from "@middlewares/controlAccess";
import usersRouter from "./resources/users.router";
import vaultRouter from "./resources/vault.router";
import emailsRouter from "./resources/emails.router";
import logsRouter from "./resources/logs.router";

const router = Router();

router.get("/ping", (req, res) => {
    res.sendStatus(200);
});

router.get("/validate/control-access", controlAccess, (req, res) => {
    res.sendStatus(200);
});

router.use("/recurring-transactions", [controlAccess], recurringTransactionRouter);
router.use("/treasury", [controlAccess], treasuryRouter);
router.use("/vaults", [controlAccess], vaultRouter);
router.use("/users", [controlAccess], usersRouter);
router.use("/emails", [controlAccess], emailsRouter);
router.use("/logs", [controlAccess], logsRouter);

export default router;