import type { CronTask } from "@utils/types/crons";

const cronExecuter: CronTask = {
   name: "cronExecuter",
   schedule: false ? "* * * * *" : "0 0 * * *",
   enabled: true,
   task: async () => {
       await execute();
   }
};

const execute = async () => {
   try {
      console.log("cron")
   } catch (error) {
       throw error;
   }
};

export default cronExecuter;