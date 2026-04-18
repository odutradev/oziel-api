import { Router } from "express"

import marketingCalendarResource from "@resources/marketing/calendar.resource"
import manageRequest from "@middlewares/manageRequest"
import hasRole from "@middlewares/hasRole"

const marketingCalendarRouter = Router()

marketingCalendarRouter.get("/", [hasRole([])], manageRequest(marketingCalendarResource.getCalendarItems))
marketingCalendarRouter.patch("/:id", [hasRole([])], manageRequest(marketingCalendarResource.updateCalendarItem))
marketingCalendarRouter.post("/:id/schedule", [hasRole([])], manageRequest(marketingCalendarResource.scheduleDraft))
marketingCalendarRouter.post("/:id/send-approval", [hasRole([])], manageRequest(marketingCalendarResource.sendForApproval))
marketingCalendarRouter.post("/:id/review", [hasRole([])], manageRequest(marketingCalendarResource.reviewApproval))

export default marketingCalendarRouter