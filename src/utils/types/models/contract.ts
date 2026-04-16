import type { Types } from "mongoose";

export const CONTRACT_TYPES = {
    OTHERS: "OTHERS",
    PNAE: "PNAE",
    PAA: "PAA"
} as const;

export const CONTRACT_STATUS = {
    IRREGULAR: "IRREGULAR",
    INACTIVE: "INACTIVE",
    REGULAR: "REGULAR",
    ACTIVE: "ACTIVE"
} as const;

export type ContractType = typeof CONTRACT_TYPES[keyof typeof CONTRACT_TYPES];
export type ContractStatusType = typeof CONTRACT_STATUS[keyof typeof CONTRACT_STATUS];

export const CONTRACT_TYPES_ARRAY = Object.values(CONTRACT_TYPES);
export const CONTRACT_STATUS_ARRAY = Object.values(CONTRACT_STATUS);

export type ContractModelType = {
    _id?: Types.ObjectId;
    code: string;
    type: ContractType;
    status: ContractStatusType;
    contractDate: Date;
    deliveryForecast: Date;
    endDate?: Date;
    totalValue: number;
    totalSalePrice: number;
    createdAt?: Date;
    updatedAt?: Date;
};