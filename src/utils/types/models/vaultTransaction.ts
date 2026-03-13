import type { Types } from "mongoose";

export const VAULT_TRANSACTION_TYPES = {
    WITHDRAWAL: "WITHDRAWAL",
    DEPOSIT: "DEPOSIT"
} as const;

export type VaultTransactionType = typeof VAULT_TRANSACTION_TYPES[keyof typeof VAULT_TRANSACTION_TYPES];

export const VAULT_TRANSACTION_TYPES_ARRAY = Object.values(VAULT_TRANSACTION_TYPES);

export type VaultTransactionModelType = {
    _id?: Types.ObjectId;
    vaultID: Types.ObjectId;
    amount: number;
    type: VaultTransactionType;
    description?: string;
    date: Date;
    createdAt?: Date;
    updatedAt?: Date;
};