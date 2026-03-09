import emailTemplateModel from "@database/model/emailTemplate";
import email from "../index";

export interface SendEmailFromTemplateParams {
    to: string | string[];
    trigger: string;
    variables?: Record<string, string>;
    from?: string;
}

interface SendEmailFromTemplateResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

const sendEmailFromTemplate = async ({ to, trigger, variables = {}, from }: SendEmailFromTemplateParams): Promise<SendEmailFromTemplateResult> => {
    try {
        const template = await emailTemplateModel.findOne({ trigger, active: true });
        
        if (!template) {
            return {
                success: false,
                error: `Template not found or inactive for trigger: ${trigger}`
            };
        }

        const transporter = await email.getInstance();
        
        let processedBody = template.markdownBody;
        let processedSubject = template.subject;

        Object.entries(variables).forEach(([key, value]) => {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            processedBody = processedBody.replace(regex, String(value));
            processedSubject = processedSubject.replace(regex, String(value));
        });
        
        const mailOptions = {
            from: from || process.env.EMAIL_FROM,
            to: Array.isArray(to) ? to.join(', ') : to,
            subject: processedSubject,
            markdown: processedBody
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

export default sendEmailFromTemplate;