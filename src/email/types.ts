import type { Transporter } from 'nodemailer';

export interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

export interface EmailTemplateVariables {
    [key: string]: string | number | boolean;
}

export interface SendEmailParams {
    to: string | string[];
    subject: string;
    template: string;
    variables?: EmailTemplateVariables;
    from?: string;
}

export type EmailTransporter = Transporter;

export interface EmailModule {
    transporter: EmailTransporter | null;
    initializeEmail: () => Promise<{ transporter: EmailTransporter }>;
    getInstance: () => Promise<EmailTransporter>;
}