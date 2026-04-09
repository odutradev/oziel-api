import { Router } from "express";

import emailsResource from "@resources/emails/emails.resource";
import manageRequest from "@middlewares/manageRequest";
import hasRole from "@middlewares/hasRole";

const emailsRouter = Router();

emailsRouter.post("/templates", [hasRole([])], manageRequest(emailsResource.createTemplate));
emailsRouter.get("/templates", [hasRole([])], manageRequest(emailsResource.getAllTemplates));
emailsRouter.get("/templates/:templateID", [hasRole([])], manageRequest(emailsResource.getTemplate));
emailsRouter.patch("/templates/:templateID", [hasRole([])], manageRequest(emailsResource.updateTemplate));
emailsRouter.delete("/templates/:templateID", [hasRole([])], manageRequest(emailsResource.deleteTemplate));
emailsRouter.post("/templates/seed-initial", [hasRole([])], manageRequest(emailsResource.seedInitialTemplates));

emailsRouter.post("/deliveries/bulk", [hasRole([])], manageRequest(emailsResource.sendBulkEmail));
emailsRouter.post("/deliveries/broadcast", [hasRole([])], manageRequest(emailsResource.sendToAllUsers));

export default emailsRouter;