import { Router } from "express";

import emailsResource from "@resources/emails/emails.resource";
import manageRequest from "@middlewares/manageRequest";

const emailsRouter = Router();

emailsRouter.post("/templates", manageRequest(emailsResource.createTemplate));
emailsRouter.get("/templates", manageRequest(emailsResource.getAllTemplates));
emailsRouter.get("/templates/:templateID", manageRequest(emailsResource.getTemplate));
emailsRouter.patch("/templates/:templateID", manageRequest(emailsResource.updateTemplate));
emailsRouter.delete("/templates/:templateID", manageRequest(emailsResource.deleteTemplate));
emailsRouter.post("/templates/seed-initial", manageRequest(emailsResource.seedInitialTemplates));

emailsRouter.post("/deliveries/bulk", manageRequest(emailsResource.sendBulkEmail));
emailsRouter.post("/deliveries/broadcast", manageRequest(emailsResource.sendToAllUsers));

export default emailsRouter;