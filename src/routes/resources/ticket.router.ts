import { Router } from "express";

import ticketResource from "@resources/it/ticket.resource";
import manageRequest from "@middlewares/manageRequest";
import hasRole from "@middlewares/hasRole";

const ticketRouter = Router();

ticketRouter.post("/", [hasRole([])], manageRequest(ticketResource.createTicket));
ticketRouter.get("/", [hasRole([])], manageRequest(ticketResource.getAllTickets));
ticketRouter.get("/dashboard", [hasRole([])], manageRequest(ticketResource.getDashboardMetrics));
ticketRouter.get("/:id", [hasRole([])], manageRequest(ticketResource.getTicketById));
ticketRouter.patch("/:id", [hasRole([])], manageRequest(ticketResource.updateTicket));
ticketRouter.delete("/:id", [hasRole([])], manageRequest(ticketResource.deleteTicket));

export default ticketRouter;