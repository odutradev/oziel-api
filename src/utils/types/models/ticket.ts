import type { Types } from "mongoose";

export const TICKET_STATUS = {
    OPEN: "OPEN",
    ANALYSIS: "ANALYSIS",
    WAITING_USER: "WAITING_USER",
    INTERVENTION: "INTERVENTION",
    TESTING: "TESTING",
    VALIDATION: "VALIDATION",
    CLOSED: "CLOSED"
} as const;

export const TICKET_PRIORITY = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
    CRITICAL: "CRITICAL"
} as const;

export type TicketStatusType = typeof TICKET_STATUS[keyof typeof TICKET_STATUS];
export type TicketPriorityType = typeof TICKET_PRIORITY[keyof typeof TICKET_PRIORITY];

export const TICKET_STATUS_ARRAY = Object.values(TICKET_STATUS);
export const TICKET_PRIORITY_ARRAY = Object.values(TICKET_PRIORITY);

export type TicketModelType = {
    _id?: Types.ObjectId;
    requester: Types.ObjectId;
    assignedTo?: Types.ObjectId;
    title: string;
    description: string;
    status: TicketStatusType;
    priority: TicketPriorityType;
    resolutionNotes?: string;
    createdAt?: Date;
    updatedAt?: Date;
};