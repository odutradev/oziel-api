import type { Bucket } from "@storage/types";

export interface UploadFileParams {
    path: string;
    buffer: Buffer;
    mimeType: string;
    isPublic?: boolean;
}

export interface UploadFileResult {
    url: string;
    bucket: Bucket;
}

export interface MoveFileParams {
    sourcePath: string;
    destinationPath: string;
}

export interface MoveFileResult {
    success: boolean;
    bucket: Bucket;
}

export interface DeleteFileParams {
    path: string;
}

export interface DeleteFileResult {
    success: boolean;
    bucket: Bucket;
}

export interface GetFileParams {
    path: string;
}

export interface GetFileResult {
    buffer: Buffer;
    metadata: any;
    bucket: Bucket;
}

export interface GetSignedUrlParams {
    path: string;
    expiresInMinutes?: number;
    forceDownload?: boolean;
    filename?: string;
}

export interface GetSignedUrlResult {
    signedUrl: string;
    expiresAt: Date;
}