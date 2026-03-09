import type { EmailTemplateVariables } from "../types";

interface ProcessTemplateParams {
    template: string;
    variables?: EmailTemplateVariables;
}

interface ProcessTemplateResult {
    processed: string;
}

const processTemplate = ({ template, variables = {} }: ProcessTemplateParams): ProcessTemplateResult => {
    let processed = template;

    Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        processed = processed.replace(regex, String(value));
    });

    return { processed };
};

export default processTemplate;