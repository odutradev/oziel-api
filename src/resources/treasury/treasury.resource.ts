import treasuryService, { TRANSACTION_TYPES } from "@utils/services/treasury.service";
import transactionModel from "@database/model/transaction";

import type { ManageRequestBody } from "@middlewares/manageRequest";

const treasuryResource = {
    addTransaction: async ({ data, manageError, ids, createLog }: ManageRequestBody) => {
        try {
            const { description, amount, type, referenceDate } = data;
            if (!description || !amount || !type) return manageError({ code: "invalid_data" });

            const validDate = referenceDate ? new Date(referenceDate) : new Date();
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
                entityID: String(transaction._id),
                userID: ids.userID,
                data: { description: "Transação criada", type, amount }
            });

            return transaction;
        } catch (error) {
            return manageError({ code: "internal_error", error });
        }
    },
    getMonthlySummary: async ({ querys, manageError, ids }: ManageRequestBody) => {
        try {
            const currentDate = new Date();
            const targetYear = Number(querys.year) || currentDate.getFullYear();
            const targetMonth = Number(querys.month) || (currentDate.getMonth() + 1);

            const jsTargetMonth = targetMonth - 1;
            const startDate = new Date(targetYear, jsTargetMonth, 1);
            const endDate = new Date(targetYear, jsTargetMonth + 1, 0, 23, 59, 59, 999);

            const transactions = await transactionModel.find({
                userID: ids.userID,
                referenceDate: { $gte: startDate, $lte: endDate }
            }).sort({ referenceDate: -1 });

            const summary = transactions.reduce((acc, curr) => {
                const isIncome = curr.type === TRANSACTION_TYPES.INCOME;
                const amount = Number(curr.amount);

                return {
                    income: isIncome ? acc.income + amount : acc.income,
                    expense: !isIncome ? acc.expense + amount : acc.expense,
                    balance: isIncome ? acc.balance + amount : acc.balance - amount,
                };
            }, { income: 0, expense: 0, balance: 0 });

            return { ...summary, transactions };
        } catch (error) {
            return manageError({ code: "internal_error", error });
        }
    },
    closeMonth: async ({ data, manageError, ids, createLog }: ManageRequestBody) => {
        try {
            const targetMonth = Number(data.month);
            const targetYear = Number(data.year);

            if (isNaN(targetMonth) || isNaN(targetYear)) return manageError({ code: "invalid_data" });

            try {
                const { finalBalance, carryOverTransaction } = await treasuryService.processMonthClose(targetMonth, targetYear, String(ids.userID));

                await createLog({
                    action: "system_action",
                    entity: "system",
                    entityID: String(carryOverTransaction._id),
                    userID: ids.userID,
                    data: { description: "Mês fechado manualmente", finalBalance }
                });

                return { success: true, carryOverTransaction };
            } catch (err: unknown) {
                const isKnownError = err instanceof Error && err.message === "carry_over_already_exists";
                if (isKnownError) return manageError({ code: "invalid_data" });
                return manageError({ code: "internal_error", error: err });
            }
        } catch (error) {
            return manageError({ code: "internal_error", error });
        }
    }
};

export default treasuryResource;