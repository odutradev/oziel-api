import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const ENCODING = "hex";
const SEPARATOR = ":";

const cryptoService = {
    hashPassword: async (password: string): Promise<string> => {
        const salt = randomBytes(SALT_LENGTH).toString(ENCODING);
        const derivedKey = await scryptAsync(password, salt, KEY_LENGTH) as Buffer;
        return `${salt}${SEPARATOR}${derivedKey.toString(ENCODING)}`;
    },
    comparePassword: async (password: string, storedHash: string): Promise<boolean> => {
        const [salt, hash] = storedHash.split(SEPARATOR);
        if (!salt || !hash) return false;
        
        const hashBuffer = Buffer.from(hash, ENCODING);
        const suppliedHashBuffer = await scryptAsync(password, salt, KEY_LENGTH) as Buffer;
        
        if (hashBuffer.length !== suppliedHashBuffer.length) return false;
        return timingSafeEqual(hashBuffer, suppliedHashBuffer);
    }
};

export default cryptoService;