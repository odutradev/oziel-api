export const ROLES = {
    DIRETOR_PRESIDENTE: "diretor_presidente",
    DIRETOR_VICE_PRESIDENTE: "diretor_vice_presidente",
    DIRETOR_FINANCEIRO: "diretor_financeiro",
    DIRETOR_SUPRIMENTOS_CONTRATOS: "diretor_suprimentos_contratos",
    DIRETOR_MANUTENCAO: "diretor_manutencao",
    DIRETOR_ADMINISTRATIVO_RH: "diretor_administrativo_rh",
    DIRETOR_PRODUCAO_AGROPECUARIA: "diretor_producao_agropecuaria",
    DIRETOR_TI_MARKETING: "diretor_ti_marketing",
    ASSESSOR_TECNICO_JURIDICO: "assessor_tecnico_juridico",
    MEMBRO_ASSEMBLEIA: "membro_assembleia",
    NORMAL: "normal"
} as const;

export const ROLES_ARRAY = Object.values(ROLES);

export type RoleType = typeof ROLES[keyof typeof ROLES];