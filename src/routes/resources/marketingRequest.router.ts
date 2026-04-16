import { Router } from "express";

import marketingRequestResource from "@resources/marketing/request.resource";
import manageRequest from "@middlewares/manageRequest";
import hasRole from "@middlewares/hasRole";

const marketingRequestRouter = Router();

marketingRequestRouter.post("/", [hasRole([])], manageRequest(marketingRequestResource.createRequest));
marketingRequestRouter.get("/", [hasRole([])], manageRequest(marketingRequestResource.getAllRequests));
marketingRequestRouter.get("/:id", [hasRole([])], manageRequest(marketingRequestResource.getRequestById));
marketingRequestRouter.patch("/:id", [hasRole([])], manageRequest(marketingRequestResource.updateRequest));
marketingRequestRouter.delete("/:id", [hasRole([])], manageRequest(marketingRequestResource.deleteRequest));

marketingRequestRouter.post("/:id/send-approval", [hasRole([])], manageRequest(marketingRequestResource.sendForApproval));
marketingRequestRouter.post("/:id/review", [hasRole([])], manageRequest(marketingRequestResource.reviewApproval));

export default marketingRequestRouter;