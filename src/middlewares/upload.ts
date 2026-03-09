import fs from "fs/promises";
import multer from "multer";
import path from "path";

import stringService from "@utils/services/string.services";

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const CACHE_DIR = path.resolve(process.cwd(), "cache/files");

const ensureDirectoryExists = async (dirPath: string) => {
    try {
        await fs.access(dirPath);
    } catch {
        await fs.mkdir(dirPath, { recursive: true });
    }
};

export const deleteCacheFiles = async (files: Express.Multer.File[]) => {
    if (!files?.length) return;

    await Promise.all(
        files.map(async (file) => {
            if (file.path) await fs.unlink(file.path).catch(() => null);
        })
    );
};

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            await ensureDirectoryExists(CACHE_DIR);
            cb(null, CACHE_DIR);
        } catch (error) {
            cb(error as Error, "");
        }
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${stringService.removeSpacesAndLowerCase(file.originalname)}`;
        cb(null, fileName);
    },
});

const upload = multer({
    limits: { fileSize: MAX_FILE_SIZE },
    storage,
});

export default upload;