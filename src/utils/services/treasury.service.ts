import transactionModel from "@database/model/transaction";
import dateService from "@utils/services/date.service";

import type { Types } from "mongoose";

export const TRANSACTION_TYPES = {
    EXPENSE: "EXPENSE",
    INCOME: "INCOME"
} as const;

const treasuryService = {
    processMonthClose: async (month: number, year: number, userID: Types.ObjectId | string) => {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

        const transactions = await transactionModel.find({
            referenceDate: { $gte: startDate, $lte: endDate }
        });

        const finalBalance = transactions.reduce((acc, curr) => {
            return curr.type === TRANSACTION_TYPES.INCOME ? acc + curr.amount : acc - curr.amount;
        }, 0);

        const nextMonthDate = new Date(year, month + 1, 1, 12, 0, 0);

        const existingCarryOver = await transactionModel.findOne({
            isCarryOver: true,
            referenceDate: {
                $gte: new Date(year, month + 1, 1),
                $lte: new Date(year, month + 1, 1, 23, 59, 59, 999)
            }
        });

        if (existingCarryOver) throw new Error("carry_over_already_exists");

        const carryOverTransaction = await transactionModel.create({
            type: finalBalance >= 0 ? TRANSACTION_TYPES.INCOME : TRANSACTION_TYPES.EXPENSE,
            description: `Saldo transportado (${month + 1}/${year})`,
            amount: Math.abs(finalBalance),
            referenceDate: nextMonthDate,
            isCarryOver: true,
            userID
        });

        return { finalBalance, carryOverTransaction };
    }
};

export default treasuryService;