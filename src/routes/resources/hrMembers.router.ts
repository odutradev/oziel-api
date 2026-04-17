import { Router } from "express";

import membersResource from "@resources/hr/members.resource";
import manageRequest from "@middlewares/manageRequest";

const hrMembersRouter = Router();

hrMembersRouter.post("/", manageRequest(membersResource.createMember));
hrMembersRouter.get("/", manageRequest(membersResource.getAllMembers));
hrMembersRouter.get("/dashboard", manageRequest(membersResource.getDashboardMetrics));
hrMembersRouter.get("/:id", manageRequest(membersResource.getMemberById));
hrMembersRouter.patch("/:id", manageRequest(membersResource.updateMember));
hrMembersRouter.delete("/:id", manageRequest(membersResource.deleteMember));

export default hrMembersRouter;