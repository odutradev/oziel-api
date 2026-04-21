import { Router } from "express";

import meetingMinuteResource from "@resources/secretary/meetingMinute.resource";
import manageRequest from "@middlewares/manageRequest";

const meetingMinuteRouter = Router();

meetingMinuteRouter.get("/", manageRequest(meetingMinuteResource.getAllMinutes));
meetingMinuteRouter.get("/:id", manageRequest(meetingMinuteResource.getMinuteById));
meetingMinuteRouter.post("/", manageRequest(meetingMinuteResource.createMinute));
meetingMinuteRouter.patch("/:id", manageRequest(meetingMinuteResource.updateMinute));
meetingMinuteRouter.delete("/:id", manageRequest(meetingMinuteResource.deleteMinute));

export default meetingMinuteRouter;