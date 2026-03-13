import { RECURRING_FREQUENCIES } from "@utils/types/models/recurringTransaction";
import recurringTransactionModel from "@database/model/recurringTransaction";
import { TRANSACTION_STATUS } from "@utils/types/models/transaction";
import transactionModel from "@database/model/transaction";
import dateService from "@utils/services/date.service";

import type { RecurringFrequencyType } from "@utils/types/models/recurringTransaction";
import type { CronTask } from "@utils/types/crons";

const getNextDate = (date: Date, frequency: RecurringFrequencyType, intervalDays?: number, dayOfMonth?: number): Date => {
    const next = new Date(date);
    const frequencyActions: Record<string, () => void> = {
        [RECURRING_FREQUENCIES.DAILY]: () => next.setDate(next.getDate() + 1),
        [RECURRING_FREQUENCIES.WEEKLY]: () => next.setDate(next.getDate() + 7),
        [RECURRING_FREQUENCIES.YEARLY]: () => next.setFullYear(next.getFullYear() + 1),
        [RECURRING_FREQUENCIES.MONTHLY]: () => {
            next.setMonth(next.getMonth() + 1);
            if (dayOfMonth) next.setDate(Math.min(dayOfMonth, new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()));
        },
        [RECURRING_FREQUENCIES.CUSTOM_DAYS]: () => {
            if (intervalDays) next.setDate(next.getDate() + intervalDays);
        }
    };
    frequencyActions[frequency]?.();
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