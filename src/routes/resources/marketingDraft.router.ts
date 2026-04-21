import { Router } from "express";

import marketingDraftResource from "@resources/marketing/draft.resource";
import manageRequest from "@middlewares/manageRequest";

const marketingDraftRouter = Router();

marketingDraftRouter.get("/", manageRequest(marketingDraftResource.getAllDrafts));
marketingDraftRouter.get("/:id", manageRequest(marketingDraftResource.getDraft));
marketingDraftRouter.post("/", manageRequest(marketingDraftResource.createDraft));
marketingDraftRouter.patch("/:id", manageRequest(marketingDraftResource.updateDraft));
marketingDraftRouter.delete("/:id", manageRequest(marketingDraftResource.deleteDraft));

export default marketingDraftRouter;