import { Router } from "express";

import emailsResource from "@resources/emails/emails.resource";
import manageRequest from "@middlewares/manageRequest";
import hasRole from "@middlewares/hasRole";

const emailsRouter = Router();

emailsRouter.post("/templates/create", [hasRole([])], manageRequest(emailsResource.createTemplate));
emailsRouter.patch("/templates/:templateID", [hasRole([])], manageRequest(emailsResource.updateTemplate));
emailsRouter.delete("/templates/:templateID", [hasRole([])], manageRequest(emailsResource.deleteTemplate));
emailsRouter.get("/templates/:identifier", [hasRole([])], manageRequest(emailsResource.getTemplate));
emailsRouter.get("/templates", [hasRole([])], manageRequest(emailsResource.getAllTemplates));

emailsRouter.post("/send/bulk", [hasRole([])], manageRequest(emailsResource.sendBulkEmail));
emailsRouter.post("/send/all-users", [hasRole([])], manageRequest(emailsResource.sendToAllUsers));

emailsRouter.post("/seed/initial-templates", [hasRole([])], manageRequest(emailsResource.seedInitialTemplates));

export default emailsRouter;