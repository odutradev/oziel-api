import { Request } from "express";

import requestHelper from "@utils/services/requestHelper.service";
import dateService from "@utils/services/date.service";
import logModel from "@database/model/log";

interface LogPayload {
    action: string;
    userID?: string;
    entityID: string;
    entity: string;
    data?: any;
    req?: Request;
    additionalInfo?: any;
}

const logService = {
    createLog: async ({ action, userID, entityID, entity, data, req, additionalInfo }: LogPayload) => {
        try {
            let description = "";

            switch(action) {
                case "user_created":
                    description = `Conta criada como *${data?.name || data?.email || "Usuário"}*`;
                    break;
                
                case "user_updated":
                    const updatedFields = data?.updatedFields || [];
                    description = `Atualização no perfil - Campos: *${updatedFields.join(", ") || "Nenhum"}*`;
                    break;
                
                case "user_deleted":
                    description = `Conta deletada`;
                    break;
                
                case "user_signin":
                    description = `Login realizado`;
                    break;
                
                case "user_signup":
                    description = `Cadastro concluído`;
                    break;
                    
                case "system_action":
                    description = `Ação do sistema: ${data?.description || "N/A"}`;
                    break;
                
                default:
                    description = `Ação: ${action}`;
                    break;
            }

            const metadata = req ? requestHelper.getMetadata(req, additionalInfo) : undefined;

            const newLog = new logModel({
                timestamp: dateService.now(),
                description,
                entityID,
                payload: data,
                metadata,
                userID,
                action,
                entity
            });

            return await newLog.save();
        } catch (error) {
            console.error("[logService.createLog] Error creating log:", error);
            throw error;
        }
    }
};

export default logService;