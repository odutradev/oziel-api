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

export type RoleType = typeof ROLES[keyof typeof ROLES];

export const ROLES_ARRAY: RoleType[] = Object.values(ROLES);

export const SUPER_ROLES: RoleType[] = [
    ROLES.DIRETOR_VICE_PRESIDENTE,
    ROLES.DIRETOR_PRESIDENTE,
    ROLES.ADMIN
];
