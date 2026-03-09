import nodemailer, { Transporter } from "nodemailer";
import { marked } from "marked";

import logger from "@utils/functions/logger";

import type { EmailConfig, EmailModule } from "./types";

const SECURE_PORT = 465;
const EXIT_FAILURE_CODE = 1;

const email: EmailModule = {
    transporter: null,
    initializeEmail: async (): Promise<{ transporter: Transporter }> => {
        try {
            const host = process.env.EMAIL_HOST;
            const port = Number(process.env.EMAIL_PORT);
            const user = process.env.EMAIL_USER;
            const pass = process.env.EMAIL_PASS;

            if (!host || !port || !user || !pass) {
                logger.error("[initializeEmail] Missing email credentials");
                process.exit(EXIT_FAILURE_CODE);
            }

            const config: EmailConfig = {
                secure: port === SECURE_PORT,
                auth: { user, pass },
                host,
                port
            };

            email.transporter = nodemailer.createTransport(config);

            email.transporter.use("compile", async (mail, callback) => {
                const mailData = mail.data as { markdown?: string; html?: string };
                if (mailData.markdown) mailData.html = await marked.parse(mailData.markdown);
                callback();
            });

            logger.info("Email service initialized with markdown support");

            return { transporter: email.transporter };
        } catch (error) {
            logger.error("[initializeEmail] Email initialization error");
            console.error(error);
            process.exit(EXIT_FAILURE_CODE);
        }
    },
    getInstance: async (): Promise<Transporter> => {
        if (!email.transporter) {
            logger.info("[getInstance] Email not initialized, initializing now");
            await email.initializeEmail();
            if (!email.transporter) throw new Error("Failed to initialize email transporter");
        }
        return email.transporter;
    }
};

export default email;