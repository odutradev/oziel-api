import sharp from "sharp";

interface CompressImageParams {
    format?: "jpeg" | "png" | "webp";
    maxHeight?: number;
    maxWidth?: number;
    quality?: number;
    buffer: Buffer;
}

interface CompressImageResult {
    compressionRatio: number;
    compressedSize: number;
    originalSize: number;
    mimeType: string;
    buffer: Buffer;
}

const imageService = {
    compressImage: async ({ buffer, maxWidth = 1024, maxHeight = 1024, quality = 80, format = "webp" }: CompressImageParams): Promise<CompressImageResult> => {
        const originalSize = buffer.length;

        const compressedBuffer = await sharp(buffer)
            .resize(maxWidth, maxHeight, { fit: "inside",  withoutEnlargement: true })
            .toFormat(format, { quality })
            .toBuffer();

        const compressedSize = compressedBuffer.length;
        const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;

        return {
            buffer: compressedBuffer,
            mimeType: `image/${format}`,
            originalSize,
            compressedSize,
            compressionRatio
        };
    },

    validateImage: async (buffer: Buffer): Promise<boolean> => {
        try {
            const metadata = await sharp(buffer).metadata();
            return !!metadata.format;
        } catch {
            return false;
        }
    },

    getImageMetadata: async (buffer: Buffer) => {
        return await sharp(buffer).metadata();
    }
};

export default imageService;