import { TRANSACTION_STATUS, TRANSACTION_TYPES } from "@utils/types/models/transaction";
import transactionModel from "@database/model/transaction";
import dateService from "@utils/services/date.service";

import type { TransactionModelType } from "@utils/types/models/transaction";
import type { ManageRequestBody } from "@middlewares/manageRequest";

const treasuryResource = {
    createTransaction: async ({ data, createLog, ids, manageError }: ManageRequestBody) => {
        const payload = data as Partial<TransactionModelType>;
        if (!payload.title || !payload.amount || !payload.type || !payload.date) return manageError({ code: "invalid_params" as never });

        const transaction = await transactionModel.create({ ...payload, status: payload.status ?? TRANSACTION_STATUS.PENDING });
        await createLog({ action: "system_action", entity: "system", entityID: transaction._id.toString(), userID: ids.userID, data: { description: "Transaction created", transaction } });

        return transaction;
    },
    updateTransaction: async ({ params, data, createLog, ids, manageError }: ManageRequestBody) => {
        const transactionID = params?.transactionID as string;
        if (!transactionID) return manageError({ code: "invalid_params" as never });

        const payload = data as Partial<TransactionModelType>;
        const updatedTransaction = await transactionModel.findByIdAndUpdate(transactionID, { ...payload, updatedAt: dateService.now() }, { new: true });
        if (!updatedTransaction) return manageError({ code: "data_not_found" as never });

        await createLog({ action: "system_action", entity: "system", entityID: transactionID, userID: ids.userID, data: { description: "Transaction updated", data } });

        return updatedTransaction;
    },
    deleteTransaction: async ({ params, createLog, ids, manageError }: ManageRequestBody) => {
        const transactionID = params?.transactionID as string;
        if (!transactionID) return manageError({ code: "invalid_params" as never });

        const deletedTransaction = await transactionModel.findByIdAndDelete(transactionID);
        if (!deletedTransaction) return manageError({ code: "data_not_found" as never });

        await createLog({ action: "system_action", entity: "system", entityID: transactionID, userID: ids.userID, data: { description: "Transaction deleted" } });

        return { success: true };
    },
    confirmTransaction: async ({ params, createLog, ids, manageError }: ManageRequestBody) => {
        const transactionID = params?.transactionID as string;
        if (!transactionID) return manageError({ code: "invalid_params" as never });

        const confirmedTransaction = await transactionModel.findByIdAndUpdate(transactionID, { status: TRANSACTION_STATUS.CONFIRMED, updatedAt: dateService.now() }, { new: true });
        if (!confirmedTransaction) return manageError({ code: "data_not_found" as never });

        await createLog({ action: "system_action", entity: "system", entityID: transactionID, userID: ids.userID, data: { description: "Transaction confirmed" } });

        return confirmedTransaction;
    },
    getMonthlyDashboard: async ({ querys, manageError }: ManageRequestBody) => {
        const year = Number(querys?.year);
        const month = Number(querys?.month);
        if (!year || !month) return manageError({ code: "invalid_params" as never });

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        const [aggBalance, monthTransactions] = await Promise.all([
            transactionModel.aggregate([{ $match: { status: TRANSACTION_STATUS.CONFIRMED } }, { $group: { _id: "$type", total: { $sum: "$amount" } } }]),
            transactionModel.find({ date: { $gte: startDate, $lte: endDate } }).sort({ date: -1 }).lean()
        ]);

        const currentBalance = (aggBalance.find(a => a._id === TRANSACTION_TYPES.INCOME)?.total ?? 0) - (aggBalance.find(a => a._id === TRANSACTION_TYPES.EXPENSE)?.total ?? 0);
        const income = monthTransactions.filter(t => t.type === TRANSACTION_TYPES.INCOME && t.status === TRANSACTION_STATUS.CONFIRMED).reduce((acc, curr) => acc + curr.amount, 0);
        const expense = monthTransactions.filter(t => t.type === TRANSACTION_TYPES.EXPENSE && t.status === TRANSACTION_STATUS.CONFIRMED).reduce((acc, curr) => acc + curr.amount, 0);
        const pendingIncome = monthTransactions.filter(t => t.type === TRANSACTION_TYPES.INCOME && t.status === TRANSACTION_STATUS.PENDING).reduce((acc, curr) => acc + curr.amount, 0);
        const pendingExpense = monthTransactions.filter(t => t.type === TRANSACTION_TYPES.EXPENSE && t.status === TRANSACTION_STATUS.PENDING).reduce((acc, curr) => acc + curr.amount, 0);

        return { currentBalance, monthlyMetrics: { income, expense, pendingIncome, pendingExpense, balance: income - expense }, transactions: monthTransactions };
    }
};

export default treasuryResource;