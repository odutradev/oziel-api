import treasuryService, { TRANSACTION_TYPES } from "@utils/services/treasury.service";
import transactionModel from "@database/model/transaction";
import dateService from "@utils/services/date.service";

import type { ManageRequestBody } from "@middlewares/manageRequest";

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

            try {
                const { finalBalance, carryOverTransaction } = await treasuryService.processMonthClose(month, year, ids.userID);

                await createLog({
                    action: "system_action",
                    entity: "system",
                    entityID: carryOverTransaction._id.toString(),
                    userID: ids.userID,
                    data: { description: "Month closed manually", finalBalance }
                });

                return { success: true, carryOverTransaction };
            } catch (err: any) {
                if (err.message === "carry_over_already_exists") return manageError({ code: "invalid_data" });
                return manageError({ code: "internal_error", error: err });
            }
        } catch (error) {
            return manageError({ code: "internal_error", error });
        }
    }
};

export default treasuryResource;