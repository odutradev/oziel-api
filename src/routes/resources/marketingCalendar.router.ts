import { Router } from "express";

import marketingCalendarResource from "@resources/marketing/calendar.resource";
import manageRequest from "@middlewares/manageRequest";

const marketingCalendarRouter = Router();

marketingCalendarRouter.get("/", manageRequest(marketingCalendarResource.getCalendarItems));
marketingCalendarRouter.get("/:id", manageRequest(marketingCalendarResource.getCalendarItem));
marketingCalendarRouter.patch("/:id", manageRequest(marketingCalendarResource.updateCalendarItem));
marketingCalendarRouter.delete("/:id", manageRequest(marketingCalendarResource.deleteCalendarItem));
marketingCalendarRouter.post("/:id/review", manageRequest(marketingCalendarResource.reviewApproval));
marketingCalendarRouter.post("/:id/schedule", manageRequest(marketingCalendarResource.scheduleDraft));
marketingCalendarRouter.post("/:id/send-approval", manageRequest(marketingCalendarResource.sendForApproval));

export default marketingCalendarRouter;