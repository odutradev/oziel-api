import storage from "@storage/index";

import type { UploadFileParams, UploadFileResult, MoveFileParams, MoveFileResult, DeleteFileParams, DeleteFileResult, GetFileParams, GetFileResult, GetSignedUrlParams, GetSignedUrlResult } from "./types";

const fileStorage = {
    upload: async ({ path, buffer, mimeType, isPublic = false }: UploadFileParams): Promise<UploadFileResult> => {
        const bucket = await storage.getInstance();
        const file = bucket.file(path);

        await file.save(buffer, {
            metadata: {
                contentType: mimeType,
            },
            public: isPublic,
        });

        if (isPublic) {
            await file.makePublic();
        }

        const url = isPublic ? `https://storage.googleapis.com/${bucket.name}/${path}` : `gs://${bucket.name}/${path}`;

        return { url, bucket };
    },

    move: async ({ sourcePath, destinationPath }: MoveFileParams): Promise<MoveFileResult> => {
        const bucket = await storage.getInstance();
        const sourceFile = bucket.file(sourcePath);
        const destinationFile = bucket.file(destinationPath);

        await sourceFile.move(destinationFile);

        return { success: true, bucket };
    },

    delete: async ({ path }: DeleteFileParams): Promise<DeleteFileResult> => {
        const bucket = await storage.getInstance();
        const file = bucket.file(path);

        await file.delete();

        return { success: true, bucket };
    },

    get: async ({ path }: GetFileParams): Promise<GetFileResult> => {
        const bucket = await storage.getInstance();
        const file = bucket.file(path);

        const [buffer] = await file.download();
        const [metadata] = await file.getMetadata();

        return { buffer, metadata, bucket };
    },

    getSignedUrl: async ({ path, expiresInMinutes = 60, forceDownload = false, filename }: GetSignedUrlParams): Promise<GetSignedUrlResult> => {
        const bucket = await storage.getInstance();
        const file = bucket.file(path);

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);

        const options: any = {
            action: 'read',
            expires: expiresAt
        };

        if (forceDownload) {
            const downloadFilename = filename || path.split('/').pop();
            options.responseDisposition = `attachment; filename="${downloadFilename}"`;
            options.responseType = 'application/pdf';
        }

        const [signedUrl] = await file.getSignedUrl(options);

        return { signedUrl, expiresAt };
    }
};

export default fileStorage;4