import type { Types } from "mongoose";

export type ProductionModelType = {
    _id?: Types.ObjectId;
    producer: Types.ObjectId;
    product: Types.ObjectId;
    referenceYear: number;
    quantity: number;
    productionArea: number;
    plantingSeason?: string;
    harvestSeason?: string;
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};