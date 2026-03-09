import dotenv from "dotenv";
dotenv.config();

import chalk from "chalk";

import defaultConfig from "@assets/config/default";
import logger from "@utils/functions/logger";
import database from "@database/database";
import cronManager from "@crons/index";
import storage from "@storage/index";
import email from "./email";
import app  from "./app";

const server = app.listen(process.env.PORT || 80, async () => {
    const address = server.address();
    const mode = defaultConfig.mode;
    if (typeof address === 'object' && address !== null) {
        const host = address.address === '::' ? 'localhost' : address.address;
        logger.info(`🚀 Server started in: ${chalk.blueBright('http://' + host + ':' + address.port)}`);
        const databaseInfo = await database.connectMongoose();
        defaultConfig.clusterName = databaseInfo.clusterName;
        await storage.initializeStorage();
        await email.initializeEmail();
        cronManager.initializeCrons();
        
        logger.info(`mode: ${mode =='developing' ? chalk.green(mode) : chalk.red(mode)} - version: ${chalk.yellow(defaultConfig.version)}`);

    };
});

process.on('SIGINT', () => {
    logger.error("[server] Server end")
    server.close();
});