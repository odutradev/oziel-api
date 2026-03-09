import { Request } from "express";

const requestHelper = {
    getClientIP: (req: Request): string => {
        const forwarded = req.headers['x-forwarded-for'];
        
        if (forwarded) {
            const ips = typeof forwarded === 'string' 
                ? forwarded.split(',') 
                : forwarded;
            return ips[0].trim();
        }
        
        return req.headers['x-real-ip'] as string || 
               req.ip || 
               req.socket.remoteAddress || 
               'unknown';
    },

    getUserAgent: (req: Request): string => {
        return req.headers['user-agent'] || 'unknown';
    },

    getMetadata: (req: Request, additionalInfo?: any) => {
        return {
            ip: requestHelper.getClientIP(req),
            userAgent: requestHelper.getUserAgent(req),
            additionalInfo
        };
    }
};

export default requestHelper;