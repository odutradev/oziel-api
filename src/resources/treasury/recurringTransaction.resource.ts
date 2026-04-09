import recurringTransactionModel from "@database/model/recurringTransaction";
import dateService from "@utils/services/date.service";

import type { RecurringTransactionModelType } from "@utils/types/models/recurringTransaction";
import type { ManageRequestBody } from "@middlewares/manageRequest";

const recurringTransactionResource = {
    createRecurringTransaction: async ({ data, createLog, ids, manageError }: ManageRequestBody) => {
        const payload = data as Partial<RecurringTransactionModelType>;
        if (!payload.title || !payload.amount || !payload.type || !payload.frequency || !payload.nextExecution) return manageError({ code: "invalid_params" as never });

        const recurringTransaction = await recurringTransactionModel.create({ ...payload, active: payload.active ?? true });
        await createLog({ action: "system_action", entity: "system", entityID: recurringTransaction._id.toString(), userID: ids.userID, data: { description: "Recurring transaction created", recurringTransaction } });

        return recurringTransaction;
    },
    updateRecurringTransaction: async ({ params, data, createLog, ids, manageError }: ManageRequestBody) => {
        const transactionID = params?.id as string;
        if (!transactionID) return manageError({ code: "invalid_params" as never });

        const payload = data as Partial<RecurringTransactionModelType>;
        const updatedTransaction = await recurringTransactionModel.findByIdAndUpdate(transactionID, { ...payload, updatedAt: dateService.now() }, { new: true });
        if (!updatedTransaction) return manageError({ code: "data_not_found" as never });

        await createLog({ action: "system_action", entity: "system", entityID: transactionID, userID: ids.userID, data: { description: "Recurring transaction updated", data } });

        return updatedTransaction;
    },
    deleteRecurringTransaction: async ({ params, createLog, ids, manageError }: ManageRequestBody) => {
        const transactionID = params?.id as string;
        if (!transactionID) return manageError({ code: "invalid_params" as never });

        const deletedTransaction = await recurringTransactionModel.findByIdAndDelete(transactionID);
        if (!deletedTransaction) return manageError({ code: "data_not_found" as never });

        await createLog({ action: "system_action", entity: "system", entityID: transactionID, userID: ids.userID, data: { description: "Recurring transaction deleted" } });

        return { success: true };
    },
    getAllRecurringTransactions: async ({ querys, manageError }: ManageRequestBody) => {
        const pageNum = Number(querys?.page) || 1;
        const limitNum = Number(querys?.limit) || 10;
        if (pageNum < 1 || limitNum < 1) return manageError({ code: "invalid_params" as never });

        const skip = (pageNum - 1) * limitNum;
        const [data, total] = await Promise.all([
            recurringTransactionModel.find().sort({ nextExecution: 1 }).skip(skip).limit(limitNum).lean(),
            recurringTransactionModel.countDocuments()
        ]);

        return { data, meta: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum } };
    }
};

export default recurringTransactionResource;