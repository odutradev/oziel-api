import { isValidObjectId } from "mongoose";

import emailTemplateModel from "@database/model/emailTemplate";
import sendEmailFromTemplate from "@email/functions/sendEmailFromTemplate";
import stringService from "@utils/services/string.services";
import objectService from "@utils/services/object.service";
import dateService from "@utils/services/date.service";
import userModel from "@database/model/user";

import type { ManageRequestBody } from "@middlewares/manageRequest";

const emailsResource = {
    createTemplate: async ({ data, manageError, ids, createLog }: ManageRequestBody) => {
        try {
            const { userID } = ids;
            if (!userID) return manageError({ code: "invalid_params" });

            let { trigger, subject, markdownBody, variables, description, active } = data;
            
            if (!trigger || !subject || !markdownBody) {
                return manageError({ code: "invalid_data" });
            }

            const existingTemplate = await emailTemplateModel.findOne({ trigger });
            if (existingTemplate) {
                return manageError({ code: "invalid_data" });
            }

            if (subject) {
                subject = stringService.normalizeString(subject);
            }

            if (description) {
                description = stringService.normalizeString(description);
            }

            const now = dateService.now();

            const newTemplate = new emailTemplateModel({
                trigger,
                subject,
                markdownBody,
                variables: variables || [],
                description,
                active: active !== undefined ? active : true,
                createdAt: now,
                updatedAt: now
            });

            const savedTemplate = await newTemplate.save();

            await createLog({
                action: "system_action",
                entity: "system",
                entityID: savedTemplate._id.toString(),
                userID,
                data: {
                    description: `Template de email criado: ${trigger}`,
                    trigger,
                    subject
                }
            });

            return savedTemplate;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },

    updateTemplate: async ({ data, params, manageError, ids, createLog }: ManageRequestBody) => {
        try {
            const { templateID } = params;
            const { userID } = ids;

            if (!templateID || !userID) {
                return manageError({ code: "invalid_params" });
            }

            const template = await emailTemplateModel.findById(templateID);
            if (!template) {
                return manageError({ code: "template_not_found" });
            }

            const filteredData = objectService.filterObject(data, ["_id", "trigger", "createdAt"]);

            if (filteredData.subject) {
                filteredData.subject = stringService.normalizeString(filteredData.subject);
            }

            if (filteredData.description) {
                filteredData.description = stringService.normalizeString(filteredData.description);
            }

            filteredData.updatedAt = dateService.now();

            const updatedTemplate = await emailTemplateModel.findByIdAndUpdate(
                templateID,
                { $set: filteredData },
                { new: true }
            );

            await createLog({
                action: "system_action",
                entity: "system",
                entityID: templateID,
                userID,
                data: {
                    description: `Template de email atualizado: ${template.trigger}`,
                    trigger: template.trigger,
                    updatedFields: Object.keys(filteredData)
                }
            });

            return updatedTemplate;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },

    getTemplate: async ({ params, manageError }: ManageRequestBody) => {
        try {
            const { identifier } = params;

            if (!identifier) {
                return manageError({ code: "invalid_params" });
            }

            let template;
            
            if (isValidObjectId(identifier)) {
                template = await emailTemplateModel.findById(identifier);
            } else {
                template = await emailTemplateModel.findOne({ trigger: identifier });
            }
            
            if (!template) {
                return manageError({ code: "template_not_found" });
            }

            return template;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },

    getAllTemplates: async ({ querys, manageError }: ManageRequestBody) => {
        try {
            const limitNum = Number(querys.limit) || 20;
            const pageNum = Number(querys.page) || 1;
            const active = querys.active;

            if (pageNum < 1 || limitNum < 1) {
                return manageError({ code: "invalid_params" });
            }

            const skip = (pageNum - 1) * limitNum;
            
            const filter = active !== undefined ? { active: active === 'true' } : {};

            const [templates, total] = await Promise.all([
                emailTemplateModel.find(filter)
                    .sort({ trigger: 1 })
                    .skip(skip)
                    .limit(limitNum),
                emailTemplateModel.countDocuments(filter)
            ]);

            return {
                templates,
                meta: {
                    total,
                    page: pageNum,
                    pages: Math.ceil(total / limitNum),
                    limit: limitNum
                }
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },

    deleteTemplate: async ({ params, manageError, ids, createLog }: ManageRequestBody) => {
        try {
            const { templateID } = params;
            const { userID } = ids;

            if (!templateID || !userID) {
                return manageError({ code: "invalid_params" });
            }

            const template = await emailTemplateModel.findById(templateID);
            if (!template) {
                return manageError({ code: "template_not_found" });
            }

            await emailTemplateModel.findByIdAndDelete(templateID);

            await createLog({
                action: "system_action",
                entity: "system",
                entityID: templateID,
                userID,
                data: {
                    description: `Template de email deletado: ${template.trigger}`,
                    trigger: template.trigger
                }
            });

            return {
                success: true,
                message: "Template deletado com sucesso"
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },

    sendBulkEmail: async ({ data, manageError, ids, createLog }: ManageRequestBody) => {
        try {
            const { userID } = ids;
            if (!userID) return manageError({ code: "invalid_params" });

            const { recipients, trigger, variables } = data;

            if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
                return manageError({ code: "invalid_data" });
            }

            if (!trigger) {
                return manageError({ code: "invalid_data" });
            }

            const template = await emailTemplateModel.findOne({ trigger, active: true });
            if (!template) {
                return manageError({ code: "invalid_data" });
            }

            const results = await Promise.allSettled(
                recipients.map(async (recipient) => {
                    const recipientVariables = {
                        ...variables,
                        ...recipient.variables
                    };

                    return await sendEmailFromTemplate({
                        to: recipient.email,
                        trigger,
                        variables: recipientVariables
                    });
                })
            );

            const successful = results.filter(r => r.status === "fulfilled" && r.value.success).length;
            const failed = results.length - successful;

            await createLog({
                action: "system_action",
                entity: "system",
                entityID: userID,
                userID,
                data: {
                    description: `Email em massa enviado: ${trigger}`,
                    trigger,
                    totalRecipients: recipients.length,
                    successful,
                    failed
                }
            });

            return {
                success: true,
                sent: successful,
                failed,
                total: recipients.length
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },

    sendToAllUsers: async ({ data, manageError, ids, createLog }: ManageRequestBody) => {
        try {
            const { userID } = ids;
            if (!userID) return manageError({ code: "invalid_params" });

            const { trigger, variables } = data;

            if (!trigger) {
                return manageError({ code: "invalid_data" });
            }

            const template = await emailTemplateModel.findOne({ trigger, active: true });
            if (!template) {
                return manageError({ code: "invalid_data" });
            }

            const users = await userModel.find({ email: { $exists: true, $ne: null } }).select('email name');

            if (users.length === 0) {
                return manageError({ code: "invalid_data" });
            }

            const results = await Promise.allSettled(
                users.map(async (user) => {
                    const userVariables = {
                        ...variables,
                        userName: user.name || 'Usuário',
                        userEmail: user.email
                    };

                    return await sendEmailFromTemplate({
                        to: user.email as string,
                        trigger,
                        variables: userVariables
                    });
                })
            );

            const successful = results.filter(r => r.status === "fulfilled" && r.value.success).length;
            const failed = results.length - successful;

            await createLog({
                action: "system_action",
                entity: "system",
                entityID: userID,
                userID,
                data: {
                    description: `Email enviado para todos os usuários: ${trigger}`,
                    trigger,
                    totalUsers: users.length,
                    successful,
                    failed
                }
            });

            return {
                success: true,
                sent: successful,
                failed,
                total: users.length
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },

    seedInitialTemplates: async ({ manageError, ids, createLog }: ManageRequestBody) => {
        try {
            const { userID } = ids;
            if (!userID) return manageError({ code: "invalid_params" });

            const templates = [
                {
                    trigger: "WELCOME",
                    subject: "Bem-vindo ao AMaisFacil",
                    description: "Email de boas-vindas enviado após cadastro",
                    variables: ["userName", "email", "date"],
                    markdownBody: `# Bem-vindo ao AMaisFacil!

Olá **{{userName}}**,

É um prazer tê-lo conosco! Sua conta foi criada com sucesso.

## Informações da sua conta:

- **Email:** {{email}}
- **Data de cadastro:** {{date}}

Agora você pode aproveitar todos os recursos da nossa plataforma.

---

Se precisar de ajuda, estamos à disposição.

Atenciosamente,  
**AMaisFacil**`
                },
                {
                    trigger: "PASSWORD_RESET",
                    subject: "Redefinição de Senha",
                    description: "Email com código para redefinir senha",
                    variables: ["code", "expirationMinutes"],
                    markdownBody: `# Redefinição de Senha

Olá,

Você solicitou a redefinição de senha da sua conta.

## Seu código de verificação é:

**{{code}}**

Este código expira em **{{expirationMinutes}} minutos**.

---

Se você não solicitou esta redefinição, ignore este email.

Atenciosamente,  
**AMaisFacil**`
                },
                {
                    trigger: "PASSWORD_CHANGED",
                    subject: "Senha Alterada com Sucesso",
                    description: "Confirmação de alteração de senha",
                    variables: ["userName", "date", "time"],
                    markdownBody: `# Senha Alterada com Sucesso

Olá **{{userName}}**,

Sua senha foi alterada com sucesso.

## Detalhes da alteração:

- **Data:** {{date}}
- **Horário:** {{time}}

---

Se você não reconhece esta alteração, entre em contato conosco imediatamente.

Atenciosamente,  
**AMaisFacil**`
                },
                {
                    trigger: "PAYMENT_COMPLETED",
                    subject: "Pagamento Confirmado - AMaisFacil",
                    description: "Confirmação de pagamento realizado",
                    variables: ["userName", "planTitle", "amount", "status", "transactionID", "date", "time", "credits", "previousCoins", "newCoins"],
                    markdownBody: `# Pagamento Confirmado!

Olá **{{userName}}**,

Seu pagamento foi confirmado com sucesso!

## Detalhes da transação:

- **Plano:** {{planTitle}}
- **Valor:** R$ {{amount}}
- **Status:** {{status}}
- **ID da transação:** {{transactionID}}
- **Data:** {{date}}
- **Horário:** {{time}}

## Créditos adicionados

**{{credits}} créditos** foram adicionados à sua conta.

- **Saldo anterior:** {{previousCoins}} créditos
- **Novo saldo:** {{newCoins}} créditos

---

Obrigado por sua compra!

Atenciosamente,  
**AMaisFacil**`
                },
                {
                    trigger: "PAYMENT_FAILED",
                    subject: "Pagamento Não Processado - AMaisFacil",
                    description: "Notificação de falha no pagamento",
                    variables: ["userName", "planTitle", "amount", "status", "transactionID", "date", "time"],
                    markdownBody: `# Pagamento Não Processado

Olá **{{userName}}**,

Infelizmente, não foi possível processar seu pagamento.

## Detalhes da transação:

- **Plano:** {{planTitle}}
- **Valor:** R$ {{amount}}
- **Status:** {{status}}
- **ID da transação:** {{transactionID}}
- **Data:** {{date}}
- **Horário:** {{time}}

---

Por favor, tente novamente ou entre em contato conosco se o problema persistir.

Atenciosamente,  
**AMaisFacil**`
                },
                {
                    trigger: "PAYMENT_CANCELLED",
                    subject: "Pagamento Cancelado - AMaisFacil",
                    description: "Notificação de cancelamento de pagamento",
                    variables: ["userName", "planTitle", "amount", "status", "transactionID", "date", "time"],
                    markdownBody: `# Pagamento Cancelado

Olá **{{userName}}**,

Seu pagamento foi cancelado.

## Detalhes da transação:

- **Plano:** {{planTitle}}
- **Valor:** R$ {{amount}}
- **Status:** {{status}}
- **ID da transação:** {{transactionID}}
- **Data:** {{date}}
- **Horário:** {{time}}

---

Se você não reconhece esta ação, entre em contato conosco imediatamente.

Atenciosamente,  
**AMaisFacil**`
                },
                {
                    trigger: "PAYMENT_LINK_CREATED",
                    subject: "Link de Pagamento - AMaisFacil",
                    description: "Email com link de pagamento",
                    variables: ["userName", "planTitle", "originalAmount", "discount", "finalAmount", "transactionID", "paymentUrl"],
                    markdownBody: `# Link de Pagamento Criado

Olá **{{userName}}**,

Seu link de pagamento foi criado com sucesso!

## Detalhes do pedido:

- **Plano:** {{planTitle}}
- **Valor original:** R$ {{originalAmount}}
- **Desconto:** R$ {{discount}}
- **Valor final:** R$ {{finalAmount}}
- **ID da transação:** {{transactionID}}

## Link de Pagamento:

{{paymentUrl}}

---

Atenciosamente,  
**AMaisFacil**`
                },
                {
                    trigger: "CREDITS_ADDED",
                    subject: "Créditos Adicionados - AMaisFacil",
                    description: "Notificação de adição de créditos de assinatura",
                    variables: ["userName", "planTitle", "creditsAdded", "previousCoins", "newCoins", "date", "time", "nextAddition"],
                    markdownBody: `# Créditos Adicionados!

Olá **{{userName}}**,

Seus créditos de assinatura foram adicionados com sucesso!

## Detalhes:

- **Plano:** {{planTitle}}
- **Créditos adicionados:** {{creditsAdded}}
- **Saldo anterior:** {{previousCoins}} créditos
- **Novo saldo:** {{newCoins}} créditos
- **Data:** {{date}}
- **Horário:** {{time}}

{{#nextAddition}}
**Próxima adição de créditos:** {{nextAddition}}
{{/nextAddition}}

---

Aproveite seus créditos!

Atenciosamente,  
**AMaisFacil**`
                },
                {
                    trigger: "BULK_EMAIL",
                    subject: "Comunicado AMaisFacil",
                    description: "Template para emails em massa",
                    variables: ["userName", "title", "content"],
                    markdownBody: `# {{title}}

Olá **{{userName}}**,

{{content}}

---

Atenciosamente,  
**AMaisFacil**`
                }
            ];

            const results = await Promise.allSettled(
                templates.map(async (templateData) => {
                    const existing = await emailTemplateModel.findOne({ trigger: templateData.trigger });
                    if (existing) {
                        return { skipped: true, trigger: templateData.trigger };
                    }

                    const template = new emailTemplateModel({
                        ...templateData,
                        active: true,
                        createdAt: dateService.now(),
                        updatedAt: dateService.now()
                    });

                    await template.save();
                    return { created: true, trigger: templateData.trigger };
                })
            );

            const created = results.filter(r => r.status === "fulfilled" && (r.value as any).created).length;
            const skipped = results.filter(r => r.status === "fulfilled" && (r.value as any).skipped).length;

            await createLog({
                action: "system_action",
                entity: "system",
                entityID: userID,
                userID,
                data: {
                    description: "Templates iniciais de email criados",
                    created,
                    skipped,
                    total: templates.length
                }
            });

            return {
                success: true,
                created,
                skipped,
                total: templates.length,
                message: `${created} templates criados, ${skipped} já existiam`
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    }
};

export default emailsResource;