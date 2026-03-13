import type { Types } from "mongoose";

export const ROLES = {
    DIRETOR_SUPRIMENTOS_CONTRATOS: "diretor_suprimentos_contratos",
    DIRETOR_PRODUCAO_AGROPECUARIA: "diretor_producao_agropecuaria",
    DIRETOR_ADMINISTRATIVO_RH: "diretor_administrativo_rh",
    DIRETOR_VICE_PRESIDENTE: "diretor_vice_presidente",
    ASSESSOR_TECNICO_JURIDICO: "assessor_tecnico_juridico",
    DIRETOR_TI_MARKETING: "diretor_ti_marketing",
    DIRETOR_PRESIDENTE: "diretor_presidente",
    DIRETOR_MANUTENCAO: "diretor_manutencao",
    DIRETOR_FINANCEIRO: "diretor_financeiro",
    MEMBRO_ASSEMBLEIA: "membro_assembleia",
    NORMAL: "normal",
    ADMIN: "admin"
} as const;

export const USER_STATUS = {
    REGISTERED: "registered",
    LOGGED_IN: "loggedIn",
    BLOCKED: "blocked"
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES];
export type UserStatusType = typeof USER_STATUS[keyof typeof USER_STATUS];

export const ROLES_ARRAY = Object.values(ROLES);
export const SUPER_ROLES = [ROLES.DIRETOR_VICE_PRESIDENTE, ROLES.DIRETOR_PRESIDENTE, ROLES.ADMIN];
export const USER_STATUS_ARRAY = Object.values(USER_STATUS);

export type UserModelType = {
    _id?: Types.ObjectId;
    role?: RoleType;
    status?: UserStatusType;
    createAt?: Date;
    lastUpdate?: Date;
    firstSignup?: Date;
    lastGetUser?: Date;
    description?: string;
    password?: string;
    cpfOrRg?: string;
    images?: {
        profile?: string;
    };
    email?: string;
    order?: number;
    name?: string;
};