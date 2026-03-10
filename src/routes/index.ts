import { Router } from "express";

import recurringTransactionRouter from "./resources/recurringTransaction.router";
import treasuryRouter from "./resources/treasury.router";
import usersRouter from "./resources/users.router";
import controlAccess from "@middlewares/controlAccess";

const router = Router();

router.get("/ping", (req, res) => {
    res.sendStatus(200);
});

router.get("/validate/control-access", controlAccess, (req, res) => {
    res.sendStatus(200);
});

router.use("/recurring-transactions", [controlAccess], recurringTransactionRouter);
router.use("/treasury", [controlAccess], treasuryRouter);
router.use("/users", [controlAccess], usersRouter);

export default router;