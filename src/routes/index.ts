import { Router } from "express";

import recurringTransactionRouter from "./resources/recurringTransaction.router";
import marketingRequestRouter from "./resources/marketingRequest.router";
import machineOperationRouter from "./resources/machineOperation.router";
import productionRouter from "./resources/production.router";
import hrMembersRouter from "./resources/hrMembers.router";
import treasuryRouter from "./resources/treasury.router";
import contractRouter from "./resources/contract.router";
import operatorRouter from "./resources/operator.router";
import productRouter from "./resources/product.router";
import controlAccess from "@middlewares/controlAccess";
import ticketRouter from "./resources/ticket.router";
import emailsRouter from "./resources/emails.router";
import usersRouter from "./resources/users.router";
import vaultRouter from "./resources/vault.router";
import assetRouter from "./resources/asset.router";
import logsRouter from "./resources/logs.router";
import auth from "@middlewares/auth";

const router = Router();

router.get("/health-check/ping", (req, res) => {
    res.sendStatus(200);
});

router.get("/system/validate-access", controlAccess, (req, res) => {
    res.sendStatus(200);
});

router.use("/hr/members", [auth, controlAccess], hrMembersRouter);
router.use("/users", [controlAccess], usersRouter);
router.use("/contracts", [auth, controlAccess], contractRouter);
router.use("/agriculture/productions", [auth, controlAccess], productionRouter);
router.use("/agriculture/products", [auth, controlAccess], productRouter);
router.use("/maintenance/machine-operations", [auth, controlAccess], machineOperationRouter);
router.use("/maintenance/operators", [auth, controlAccess], operatorRouter);
router.use("/maintenance/assets", [auth, controlAccess], assetRouter);
router.use("/treasury/recurring-transactions", [auth, controlAccess], recurringTransactionRouter);
router.use("/treasury/transactions", [auth, controlAccess], treasuryRouter);
router.use("/treasury/vaults", [auth, controlAccess], vaultRouter);
router.use("/communications/emails", [auth, controlAccess], emailsRouter);
router.use("/system/logs", [auth, controlAccess], logsRouter);
router.use("/it/tickets", [auth, controlAccess], ticketRouter);
router.use("/marketing/requests", [auth, controlAccess], marketingRequestRouter);

export default router;