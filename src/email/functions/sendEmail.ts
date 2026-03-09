import processTemplate from "./processTemplate";
import email from "../index";

import type { SendEmailParams } from "../types";

interface SendEmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

const sendEmail = async ({ to, subject, template, variables, from }: SendEmailParams): Promise<SendEmailResult> => {
    try {
        const transporter = await email.getInstance();
        
        const { processed } = processTemplate({ template, variables });
        
        const mailOptions = {
            from: from || process.env.EMAIL_FROM,
            to: Array.isArray(to) ? to.join(', ') : to,
            subject,
            markdown: processed
        };

        const info = await transporter.sendMail(mailOptions);

        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};

export default sendEmail;