import { getStorage } from "firebase-admin/storage";

export type Bucket = ReturnType<typeof getStorage>["bucket"] extends (...args: any) => infer R ? R : never;

export interface StorageInstance {
    bucket: Bucket;
}

export interface StorageModule {
    bucket: Bucket | null;
    ensureCredentialsExist: (credPath: string, base64Content: string | undefined) => Promise<void>;
    initializeStorage: () => Promise<StorageInstance>;
    getInstance: () => Promise<Bucket>;
}