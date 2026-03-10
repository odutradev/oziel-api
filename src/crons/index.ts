import * as cron from "node-cron";

import defaultConfig from "@assets/config/default";
import logger from "@utils/functions/logger";

import cronExecuter from "./resources/cronExecuter";

import type { CronTask } from "@utils/types/crons";

const cronTasks: CronTask[] = [
    cronExecuter,
];

const cronManager = {
    tasks: new Map<string, cron.ScheduledTask>(),
    taskStatus: new Map<string, boolean>(), 

    scheduleTask: ({ name, schedule, enabled, task }: CronTask) => {
        if (!enabled) {
            if (defaultConfig.logCronsStats) {
                logger.warning(`Cron task disabled: ${name}`);
            }
            return;
        }

        try {
            const scheduledTask = cron.schedule(schedule, async () => {
                const startTime = Date.now();
                if (defaultConfig.logCronsStats) {
                    logger.info(`Starting cron task: ${name}`);
                }
                cronManager.taskStatus.set(name, true);
                
                try {
                    await task();
                    const duration = Date.now() - startTime;
                    if (defaultConfig.logCronsStats) {
                        logger.success(`Cron task completed: ${name} (${duration}ms)`);
                    }
                } catch (error) {
                    if (defaultConfig.logCronsStats) {
                        logger.error(`Cron task failed: ${name}`);
                        if (defaultConfig.logError.data) console.error(error);
                    }
                } finally {
                    cronManager.taskStatus.set(name, false);
                }
            });

            cronManager.tasks.set(name, scheduledTask);
            cronManager.taskStatus.set(name, false);
            if (defaultConfig.logCronsStats) {
                logger.info(`Cron task scheduled: ${name}`);
            }

        } catch (error) {
            if (defaultConfig.logCronsStats) {
                logger.error(`Failed to schedule cron task: ${name}`);
                console.error(error);
            }
        }
    },

    initializeCrons: () => {
        try {
            cronTasks.forEach(task => {
                cronManager.scheduleTask(task);
            });

            logger.success(`Initialized ${cronTasks.length} cron tasks`);
        } catch (error) {
            if (defaultConfig.logCronsStats) {
                logger.error("Failed to initialize cron tasks");
                console.error(error);
            }
        }
    },

    startAllTasks: () => {
        if (defaultConfig.logCronsStats) {
            logger.info("Starting all cron tasks");
        }
        cronManager.tasks.forEach((task, name) => {
            task.start();
            if (defaultConfig.logCronsStats) {
                logger.info(`Started cron task: ${name}`);
            }
        });
    },

    stopAllTasks: () => {
        if (defaultConfig.logCronsStats) {
            logger.info("Stopping all cron tasks");
        }
        cronManager.tasks.forEach((task, name) => {
            task.stop();
            cronManager.taskStatus.set(name, false);
            if (defaultConfig.logCronsStats) {
                logger.info(`Stopped cron task: ${name}`);
            }
        });
    },

    getCronStatus: () => {
        const status = Array.from(cronManager.tasks.entries()).map(([name, task]) => ({
            name,
            running: cronManager.taskStatus.get(name) || false,
            schedule: cronTasks.find(t => t.name === name)?.schedule || "unknown"
        }));
        return status;
    },

    restartTask: (taskName: string) => {
        const task = cronManager.tasks.get(taskName);
        if (task) {
            task.stop();
            cronManager.taskStatus.set(taskName, false);
            task.start();
            if (defaultConfig.logCronsStats) {
                logger.info(`Restarted cron task: ${taskName}`);
            }
            return true;
        }
        return false;
    },

    getTaskInfo: (taskName: string) => {
        const task = cronManager.tasks.get(taskName);
        const taskConfig = cronTasks.find(t => t.name === taskName);
        
        if (task && taskConfig) {
            return {
                name: taskConfig.name,
                schedule: taskConfig.schedule,
                enabled: taskConfig.enabled,
                running: cronManager.taskStatus.get(taskName) || false
            };
        }
        return null;
    }
};

export default cronManager;