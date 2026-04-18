import { Router } from "express"

import recurringTransactionRouter from "./resources/recurringTransaction.router"
import machineOperationRouter from "./resources/machineOperation.router"
import marketingCalendarRouter from "./resources/marketingCalendar.router"
import marketingDraftRouter from "./resources/marketingDraft.router"
import productionRouter from "./resources/production.router"
import hrMembersRouter from "./resources/hrMembers.router"
import contractRouter from "./resources/contract.router"
import treasuryRouter from "./resources/treasury.router"
import operatorRouter from "./resources/operator.router"
import productRouter from "./resources/product.router"
import controlAccess from "@middlewares/controlAccess"
import ticketRouter from "./resources/ticket.router"
import emailsRouter from "./resources/emails.router"
import usersRouter from "./resources/users.router"
import vaultRouter from "./resources/vault.router"
import assetRouter from "./resources/asset.router"
import logsRouter from "./resources/logs.router"
import auth from "@middlewares/auth"

const router = Router()

router.get("/health-check/ping", (req, res) => {
    res.sendStatus(200)
})

router.get("/system/validate-access", controlAccess, (req, res) => {
    res.sendStatus(200)
})

router.use("/treasury/recurring-transactions", [auth, controlAccess], recurringTransactionRouter)
router.use("/maintenance/machine-operations", [auth, controlAccess], machineOperationRouter)
router.use("/agriculture/productions", [auth, controlAccess], productionRouter)
router.use("/communications/emails", [auth, controlAccess], emailsRouter)
router.use("/treasury/transactions", [auth, controlAccess], treasuryRouter)
router.use("/marketing/calendar", [auth, controlAccess], marketingCalendarRouter)
router.use("/agriculture/products", [auth, controlAccess], productRouter)
router.use("/maintenance/operators", [auth, controlAccess], operatorRouter)
router.use("/marketing/drafts", [auth, controlAccess], marketingDraftRouter)
router.use("/maintenance/assets", [auth, controlAccess], assetRouter)
router.use("/treasury/vaults", [auth, controlAccess], vaultRouter)
router.use("/system/logs", [auth, controlAccess], logsRouter)
router.use("/it/tickets", [auth, controlAccess], ticketRouter)
router.use("/hr/members", [auth, controlAccess], hrMembersRouter)
router.use("/contracts", [auth, controlAccess], contractRouter)
router.use("/users", [controlAccess], usersRouter)

export default router