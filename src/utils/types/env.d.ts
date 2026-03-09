declare namespace NodeJS {
  interface ProcessEnv {
    PRIVATE_ACCESS_TOKEN: string;
    PUBLIC_ACCESS_TOKEN: string;
    PRODUCTION: string;
    MONGO_URI: string;
    SECRET: string;
    PORT: string;
    EMAIL_HOST: string;
    EMAIL_PORT: string;
    EMAIL_USER: string;
    EMAIL_PASS: string;
    EMAIL_FROM: string;
    FIREBASE_STORAGE_BUCKET: string;
    FIREBASE_CREDENTIALS_BASE64: string;
    ALLOWED_ORIGINS?: string;
    MORGAN_FORMAT?: string;
  }
}