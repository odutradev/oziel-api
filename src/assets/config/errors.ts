interface ResponseError {
  statusCode: 100 | 101 | 102 | 200 | 201 | 202 | 204 | 301 | 302 | 304 | 400 | 401 | 403 | 404 | 409 | 429 | 500 | 501 | 502 | 503;
  message: string;
}

export const ResponseErrors = {
  admin_access_denied: { message: "Sem permissão de administrador, acesso negado", statusCode: 401 },
  author_invalid_cpf_rg: { message: "CPF ou RG inválido em um ou mais autores", statusCode: 400 },
  control_access_denied: { message: "Acesso negado, sem token de segurança", statusCode: 401 },
  internal_error: { message: "Erro no servidor", statusCode: 500 },
  invalid_credentials: { message: "Credenciais inválidas", statusCode: 401 },
  invalid_data: { message: "Dados inválidos enviados", statusCode: 400 },
  invalid_params: { message: "Parâmetros inválidos enviados", statusCode: 400 },
  no_credentials_sent: { message: "Nenhuma credencial enviada", statusCode: 401 },
  no_token: { message: "Token ausente, autorização negada", statusCode: 400 },
  token_is_not_valid: { message: "Token inválido", statusCode: 401 },
  user_already_exists: { message: "Usuário já existe", statusCode: 409 },
  user_not_found: { message: "Usuário não encontrado", statusCode: 404 },
  user_not_registered: { message: "Usuário não registrado", statusCode: 404 }
} satisfies Record<string, ResponseError>;

export type ResponseErrorsParams = keyof typeof ResponseErrors;
