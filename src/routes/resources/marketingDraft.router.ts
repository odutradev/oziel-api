import { Router } from "express"

import marketingDraftResource from "@resources/marketing/draft.resource"
import manageRequest from "@middlewares/manageRequest"
import hasRole from "@middlewares/hasRole"

const marketingDraftRouter = Router()

marketingDraftRouter.post("/", [hasRole([])], manageRequest(marketingDraftResource.createDraft))
marketingDraftRouter.get("/", [hasRole([])], manageRequest(marketingDraftResource.getAllDrafts))
marketingDraftRouter.patch("/:id", [hasRole([])], manageRequest(marketingDraftResource.updateDraft))
marketingDraftRouter.delete("/:id", [hasRole([])], manageRequest(marketingDraftResource.deleteDraft))

export default marketingDraftRouter