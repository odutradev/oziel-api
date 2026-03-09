import { Request, Response } from "express";

import defaultConfig from "@assets/config/default";
import sendError from "@utils/functions/error";
import logger from "@utils/functions/logger";
import { deleteCacheFiles } from "./upload";

import type { ResponseErrorsParams } from "@assets/config/errors";

interface ManageErrorParams {
    code: ResponseErrorsParams;
    error?: any;
}

export interface ManageRequestBody {
    defaultExpress: { res: Response; req: Request };
    files: Express.Multer.File[];
    params: any;
    querys: any;
    data: any;
    manageError: (data: ManageErrorParams) => void;
    ids: {
        userID?: string;
    };
}

interface ManageRequestParams {
    service: (manageRequestBody: ManageRequestBody) => Promise<unknown> | unknown;
}

interface ManageRequestOptionsParams {
    upload?: boolean;
}

const manageRequest = (service: ManageRequestParams["service"], options?: ManageRequestOptionsParams) => {
    return async (req: Request, res: Response) => {
        let headersSent = false;
        let files: Express.Multer.File[] = [];

        if (options?.upload) {
            if (req.file) {
                files = [req.file];
            } else if (req.files) {
                files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
            }
        }

        const manageError = ({ code, error }: ManageErrorParams) => {
            if (headersSent) return;
            headersSent = true;
            sendError({ code, error, res, local: service.name });
        };

        try {
            const manageRequestBody: ManageRequestBody = {
                defaultExpress: { res, req },
                params: req.params as Record<string, unknown>,
                querys: req.query as Record<string, unknown>,
                data: req.body as Record<string, unknown>,
                manageError,
                files,
                ids: {
                    userID: res.locals?.userID,
                },
            };

            const result = await service(manageRequestBody);

            if (options?.upload) {
               await deleteCacheFiles(files);
            }

            if (headersSent) return;

            res.set("api-database-name", defaultConfig.clusterName);
            res.set("api-version", defaultConfig.version);
            res.set("api-mode", defaultConfig.mode);
            res.status(200).json(result);
            headersSent = true;
        } catch (error) {
            if (!headersSent) {
                logger.error("[manageRequest] Request internal error");
                console.error(error);
                sendError({ code: "internal_error", res });
                headersSent = true;
            }
        }
    };
};

export default manageRequest;