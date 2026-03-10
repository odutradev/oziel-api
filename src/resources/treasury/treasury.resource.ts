import transactionModel from "@database/model/transaction";
import dateService from "@utils/services/date.service";

import type { ManageRequestBody } from "@middlewares/manageRequest";

const TRANSACTION_TYPES = {
    EXPENSE: "EXPENSE",
    INCOME: "INCOME"
} as const;

const treasuryResource = {
    addTransaction: async ({ data, manageError, ids, createLog }: ManageRequestBody) => {
        try {
            const { description, amount, type, referenceDate } = data;
            if (!description || !amount || !type) return manageError({ code: "invalid_data" });

            const validDate = referenceDate ? new Date(referenceDate) : dateService.now();
            const absoluteAmount = Math.abs(Number(amount));

            const transaction = await transactionModel.create({
                userID: ids.userID,
                referenceDate: validDate,
                amount: absoluteAmount,
                description,
                type
            });

            await createLog({
                action: "system_action",
                entity: "system",
                entityID: transaction._id.toString(),
                userID: ids.userID,
                data: { description: "Transaction created", type, amount }
            });

            return transaction;
        } catch (error) {
            return manageError({ code: "internal_error", error });
        }
    },
    getMonthlySummary: async ({ querys, manageError }: ManageRequestBody) => {
        try {
            const month = Number(querys.month) || dateService.now().getMonth();
            const year = Number(querys.year) || dateService.now().getFullYear();

            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

            const transactions = await transactionModel.find({
                referenceDate: { $gte: startDate, $lte: endDate }
            }).sort({ referenceDate: -1 });

            const summary = transactions.reduce((acc, curr) => {
                if (curr.type === TRANSACTION_TYPES.INCOME) acc.income += curr.amount;
                if (curr.type === TRANSACTION_TYPES.EXPENSE) acc.expense += curr.amount;
                acc.balance = acc.income - acc.expense;
                return acc;
            }, { income: 0, expense: 0, balance: 0, transactions });

            return summary;
        } catch (error) {
            return manageError({ code: "internal_error", error });
        }
    },
    closeMonth: async ({ data, manageError, ids, createLog }: ManageRequestBody) => {
        try {
            const month = Number(data.month);
            const year = Number(data.year);

            if (isNaN(month) || isNaN(year)) return manageError({ code: "invalid_data" });

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

            if (existingCarryOver) return manageError({ code: "invalid_data" });

            const carryOverTransaction = await transactionModel.create({
                type: finalBalance >= 0 ? TRANSACTION_TYPES.INCOME : TRANSACTION_TYPES.EXPENSE,
                description: `Saldo transportado (${month + 1}/${year})`,
                amount: Math.abs(finalBalance),
                referenceDate: nextMonthDate,
                userID: ids.userID,
                isCarryOver: true
            });

            await createLog({
                action: "system_action",
                entity: "system",
                entityID: carryOverTransaction._id.toString(),
                userID: ids.userID,
                data: { description: "Month closed", finalBalance }
            });

            return { success: true, carryOverTransaction };
        } catch (error) {
            return manageError({ code: "internal_error", error });
        }
    }
};

export default treasuryResource;