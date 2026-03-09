import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import defaultConfig from "@assets/config/default";
import router from "./routes";

const app = express();

app.set("trust proxy", true);

if (defaultConfig.mode === "production") {
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
        hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
        frameguard: { action: "deny" },
        noSniff: true,
        xssFilter: true,
    }));

    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",").map(origin => origin.trim().replace(/\/$/, "")) || [];

    app.use(cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
            callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        maxAge: 86400,
    }));
} else {
    const morganFormat = process.env.MORGAN_FORMAT || ":method :url :status :res[content-length] bytes - :response-time ms | :remote-addr | :user-agent";
    app.use(morgan(morganFormat));
    app.use(cors());
}

app.use(express.json());
app.use("/v1", router);

export default app;