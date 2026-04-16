import type { Types } from "mongoose";

export type ProductionModelType = {
    _id?: Types.ObjectId;
    referenceYear: number;
    productionArea: number;
    quantity: number;
    plantingSeason?: string;
    harvestSeason?: string;
    active: boolean;
    producer: Types.ObjectId;
    product: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
};