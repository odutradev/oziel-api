declare module 'nodemailer-markdown' {
    import { Transporter } from 'nodemailer';

    interface MarkdownOptions {
        useEmbeddedImages?: boolean;
    }

    interface MarkdownPlugin {
        markdown(options?: MarkdownOptions): (mail: any, callback: (err?: Error | null) => void) => void;
    }

    const markdown: MarkdownPlugin;
    export = markdown;
}