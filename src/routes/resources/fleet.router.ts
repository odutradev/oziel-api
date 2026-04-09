import { Router } from "express";

import fleetResource from "@resources/maintenance/fleet.resource";
import manageRequest from "@middlewares/manageRequest";
import hasRole from "@middlewares/hasRole";

const fleetRouter = Router();

fleetRouter.post("/", [hasRole([])], manageRequest(fleetResource.createFleet));
fleetRouter.get("/", [hasRole([])], manageRequest(fleetResource.getAllFleets));
fleetRouter.get("/:id", [hasRole([])], manageRequest(fleetResource.getFleetById));
fleetRouter.patch("/:id", [hasRole([])], manageRequest(fleetResource.updateFleet));
fleetRouter.delete("/:id", [hasRole([])], manageRequest(fleetResource.deleteFleet));

export default fleetRouter;