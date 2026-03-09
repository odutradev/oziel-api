import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import fs from "fs/promises";
import path from "path";

import logger from "@utils/functions/logger";

import type { StorageInstance, StorageModule } from "./types";

const production = process.env.PRODUCTION == 'true';

const storage: StorageModule = {
    bucket: null,

    ensureCredentialsExist: async (credPath: string, base64Content: string | undefined): Promise<void> => {
        try {
            await fs.access(credPath);
        } catch {
            if (!base64Content) {
                logger.error(`[ensureCredentialsExist] Credentials not found and no base64 content provided for ${credPath}`);
                throw new Error(`Missing credentials: ${credPath}`);
            }

            const credDir = path.dirname(credPath);
            await fs.mkdir(credDir, { recursive: true });

            const buffer = Buffer.from(base64Content, 'base64');
            await fs.writeFile(credPath, buffer);
            
            logger.info(`[ensureCredentialsExist] Credentials created at ${credPath}`);
        }
    },

    initializeStorage: async (): Promise<StorageInstance> => {
        try {
            const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

            if (!storageBucket) {
                logger.error("[initializeStorage] Missing Firebase credentials");
                process.exit(1);
            }

            const credPath = production ? './src/storage/credentials/production.json'  : './src/storage/credentials/homologation.json';
            
            const credBase64 = process.env.FIREBASE_CREDENTIALS_BASE64;

            await storage.ensureCredentialsExist(credPath, credBase64);

            if (getApps().length === 0) {
                const serviceAccount = JSON.parse(await fs.readFile(credPath, 'utf8'));

                initializeApp({
                    credential: cert(serviceAccount),
                    storageBucket
                });
            }

            storage.bucket = getStorage().bucket();
            
            const mode = production ? "production" : "homologation";
            logger.info(`Firebase Storage initialized in ${mode} mode`);
            
            return { bucket: storage.bucket };

        } catch (error) {
            logger.error("[initializeStorage] Storage initialization error");
            console.log(error);
            process.exit(1);
        }
    },

    getInstance: async (): Promise<any> => {
        if (!storage.bucket) {
            logger.info("[getInstance] Storage not initialized, initializing now");
            await storage.initializeStorage();
            
            if (!storage.bucket) {
                logger.error("[getInstance] Failed to initialize Storage instance");
                throw new Error("Failed to initialize Storage instance");
            }
        }
        return storage.bucket;
    }
};

export default storage;