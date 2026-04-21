import { Router } from "express";

import recurringTransactionRouter from "./resources/recurringTransaction.router";
import marketingCalendarRouter from "./resources/marketingCalendar.router";
import machineOperationRouter from "./resources/machineOperation.router";
import marketingDraftRouter from "./resources/marketingDraft.router";
import meetingMinuteRouter from "./resources/meetingMinute.router";
import productionRouter from "./resources/production.router";
import contractRouter from "./resources/contract.router";
import hrMembersRouter from "./resources/hrMembers.router";
import treasuryRouter from "./resources/treasury.router";
import operatorRouter from "./resources/operator.router";
import productRouter from "./resources/product.router";
import controlAccess from "@middlewares/controlAccess";
import emailsRouter from "./resources/emails.router";
import ticketRouter from "./resources/ticket.router";
import usersRouter from "./resources/users.router";
import assetRouter from "./resources/asset.router";
import vaultRouter from "./resources/vault.router";
import logsRouter from "./resources/logs.router";
import { ROLES } from "@utils/types/models/user";
import hasRole from "@middlewares/hasRole";
import auth from "@middlewares/auth";

const router = Router();

router.get("/health-check/ping", (req, res) => {
    res.sendStatus(200);
});

router.get("/system/validate-access", controlAccess, (req, res) => {
    res.sendStatus(200);
});

router.use("/treasury/recurring-transactions", [
    auth,
    controlAccess,
    hasRole([ROLES.DIRETOR_FINANCEIRO])
], recurringTransactionRouter);

router.use("/maintenance/machine-operations", [
    auth,
    controlAccess,
    hasRole([ROLES.DIRETOR_MANUTENCAO])
], machineOperationRouter);

router.use("/secretary/meeting-minutes", [
    auth,
    controlAccess,
    hasRole([ROLES.DIRETOR_ADMINISTRATIVO_RH, ROLES.ASSESSOR_TECNICO_JURIDICO, ROLES.MEMBRO_ASSEMBLEIA])
], meetingMinuteRouter);

router.use("/agriculture/productions", [
    auth,
    controlAccess,
    hasRole([ROLES.DIRETOR_PRODUCAO_AGROPECUARIA])
], productionRouter);

router.use("/communications/emails", [
    auth,
    controlAccess,
    hasRole([ROLES.DIRETOR_TI_MARKETING])
], emailsRouter);

router.use("/marketing/calendar", [
    auth,
    controlAccess,
    hasRole([ROLES.DIRETOR_TI_MARKETING])
], marketingCalendarRouter);

router.use("/treasury/transactions", [
    auth,
    controlAccess,
    hasRole([ROLES.DIRETOR_FINANCEIRO])
], treasuryRouter);

router.use("/agriculture/products", [
    auth,
    controlAccess,
    hasRole([ROLES.DIRETOR_PRODUCAO_AGROPECUARIA])
], productRouter);

router.use("/marketing/drafts", [
    auth,
    controlAccess,
    hasRole([ROLES.DIRETOR_TI_MARKETING])
], marketingDraftRouter);

router.use("/maintenance/operators", [
    auth,
    controlAccess,
    hasRole([ROLES.DIRETOR_MANUTENCAO])
], operatorRouter);

router.use("/maintenance/assets", [
    auth,
    controlAccess,
    hasRole([ROLES.DIRETOR_MANUTENCAO, ROLES.DIRETOR_SUPRIMENTOS_CONTRATOS])
], assetRouter);

router.use("/treasury/vaults", [
    auth,
    controlAccess,
    hasRole([ROLES.DIRETOR_FINANCEIRO])
], vaultRouter);

router.use("/it/tickets", [
    auth,
    controlAccess,
    hasRole([ROLES.DIRETOR_TI_MARKETING])
], ticketRouter);

router.use("/hr/members", [
    auth,
    controlAccess,
    hasRole([ROLES.DIRETOR_ADMINISTRATIVO_RH])
], hrMembersRouter);

router.use("/contracts", [
    auth,
    controlAccess,
    hasRole([ROLES.DIRETOR_SUPRIMENTOS_CONTRATOS, ROLES.ASSESSOR_TECNICO_JURIDICO])
], contractRouter);

router.use("/system/logs", [auth, controlAccess], logsRouter);

router.use("/users", [controlAccess], usersRouter);

export default router;