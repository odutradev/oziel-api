import { Router } from "express";

import membersResource from "@resources/hr/members.resource";
import manageRequest from "@middlewares/manageRequest";
import hasRole from "@middlewares/hasRole";

const hrMembersRouter = Router();

hrMembersRouter.post("/", [hasRole([])], manageRequest(membersResource.createMember));
hrMembersRouter.get("/", [hasRole([])], manageRequest(membersResource.getAllMembers));
hrMembersRouter.get("/:id", [hasRole([])], manageRequest(membersResource.getMemberById));
hrMembersRouter.patch("/:id", [hasRole([])], manageRequest(membersResource.updateMember));
hrMembersRouter.delete("/:id", [hasRole([])], manageRequest(membersResource.deleteMember));

export default hrMembersRouter;