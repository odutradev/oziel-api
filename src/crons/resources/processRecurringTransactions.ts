import recurringTransactionModel from "@database/model/recurringTransaction";
import { RECURRING_FREQUENCIES, TRANSACTION_STATUS } from "@utils/constants/treasury";
import transactionModel from "@database/model/transaction";
import dateService from "@utils/services/date.service";

import type { CronTask } from "@utils/types/crons";

const getNextDate = (date: Date, frequency: string, intervalDays?: number, dayOfMonth?: number): Date => {
    const next = new Date(date);
    if (frequency === RECURRING_FREQUENCIES.DAILY) next.setDate(next.getDate() + 1);
    if (frequency === RECURRING_FREQUENCIES.WEEKLY) next.setDate(next.getDate() + 7);
    if (frequency === RECURRING_FREQUENCIES.MONTHLY) {
        next.setMonth(next.getMonth() + 1);
        if (dayOfMonth) next.setDate(Math.min(dayOfMonth, new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()));
    }
    if (frequency === RECURRING_FREQUENCIES.YEARLY) next.setFullYear(next.getFullYear() + 1);
    if (frequency === RECURRING_FREQUENCIES.CUSTOM_DAYS && intervalDays) next.setDate(next.getDate() + intervalDays);
    return next;
};

const execute = async () => {
    const now = dateService.now();
    const dueTransactions = await recurringTransactionModel.find({ active: true, nextExecution: { $lte: now } });

    if (!dueTransactions.length) return;

    await Promise.allSettled(dueTransactions.map(async (recurring) => {
        try {
            await transactionModel.create({
                title: recurring.title,
                amount: recurring.amount,
                type: recurring.type,
                status: TRANSACTION_STATUS.PENDING,
                date: now,
                description: recurring.description,
                category: recurring.category
            });

            const nextExecution = getNextDate(recurring.nextExecution, recurring.frequency, recurring.intervalDays, recurring.dayOfMonth);
            await recurringTransactionModel.findByIdAndUpdate(recurring._id, { nextExecution, updatedAt: now });
        } catch (error) {
            console.error(`[processRecurringTransactions] Failed to process ${recurring._id}`, error);
        }
    }));
};

const processRecurringTransactions: CronTask = {
   name: "processRecurringTransactions",
   schedule: "0 0 * * *",
   enabled: true,
   task: async () => await execute()
};

export default processRecurringTransactions;