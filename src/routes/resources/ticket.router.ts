import { Router } from "express";

import ticketResource from "@resources/it/ticket.resource";
import manageRequest from "@middlewares/manageRequest";

const ticketRouter = Router();

ticketRouter.post("/", manageRequest(ticketResource.createTicket));
ticketRouter.get("/", manageRequest(ticketResource.getAllTickets));
ticketRouter.get("/dashboard", manageRequest(ticketResource.getDashboardMetrics));
ticketRouter.get("/:id", manageRequest(ticketResource.getTicketById));
ticketRouter.patch("/:id", manageRequest(ticketResource.updateTicket));
ticketRouter.delete("/:id", manageRequest(ticketResource.deleteTicket));

export default ticketRouter;