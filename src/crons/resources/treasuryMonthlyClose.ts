import mongoose from "mongoose";

import treasuryService from "@utils/services/treasury.service";
import dateService from "@utils/services/date.service";
import logger from "@utils/functions/logger";
import userModel from "@database/model/user";
import logModel from "@database/model/log";

import type { CronTask } from "@utils/types/crons";

const treasuryMonthlyCloseTask: CronTask = {
    name: "Treasury Monthly Close",
    schedule: "0 0 1 * *",
    enabled: true,
    task: async () => {
        try {
            const now = dateService.now();
            const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

            const month = previousMonthDate.getMonth();
            const year = previousMonthDate.getFullYear();

            const adminUser = await userModel.findOne({ role: "admin" }) || await userModel.findOne();
            const systemUserID = adminUser?._id || new mongoose.Types.ObjectId();

            const { finalBalance, carryOverTransaction } = await treasuryService.processMonthClose(month, year, systemUserID);

            await logModel.create({
                action: "system_action",
                entity: "system",
                entityID: carryOverTransaction._id,
                userID: systemUserID,
                description: "Automatic monthly treasury close executed",
                payload: { month, year, finalBalance }
            });

            logger.info(`[CRON] Treasury closed for ${month}/${year}. Balance: ${finalBalance}`);
        } catch (error: any) {
            if (error.message !== "carry_over_already_exists") {
                logger.error(`[CRON] Treasury close failed: ${error.message}`);
            }
        }
    }
};

export default treasuryMonthlyCloseTask;