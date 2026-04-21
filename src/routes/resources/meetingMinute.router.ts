import { Router } from "express"

import meetingMinuteResource from "@resources/secretary/meetingMinute.resource"
import manageRequest from "@middlewares/manageRequest"
import hasRole from "@middlewares/hasRole"

const meetingMinuteRouter = Router()

meetingMinuteRouter.get("/", [hasRole([])], manageRequest(meetingMinuteResource.getAllMinutes))
meetingMinuteRouter.get("/:id", [hasRole([])], manageRequest(meetingMinuteResource.getMinuteById))
meetingMinuteRouter.post("/", [hasRole([])], manageRequest(meetingMinuteResource.createMinute))
meetingMinuteRouter.patch("/:id", [hasRole([])], manageRequest(meetingMinuteResource.updateMinute))
meetingMinuteRouter.delete("/:id", [hasRole([])], manageRequest(meetingMinuteResource.deleteMinute))

export default meetingMinuteRouter