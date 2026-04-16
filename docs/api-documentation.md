# API Documentation - Oziel Cooperativa

## Informações Gerais

- **Base URL Padrão:** O roteamento principal atende na raiz de rotas configurada no Express (ex: `/api/v1` ou `/v1` dependendo do proxy/nginx). No frontend, considere um prefixo padrão como `baseURL`.
- **Content-Type Padrão:** `application/json` (exceto uploads).
- **Autenticação:** A maioria das rotas privadas requer um token JWT enviado no header `Authorization: Bearer <token>`.
- **Headers de Resposta:** Identificadores padrões inseridos pelos middlewares de resposta (ex: data, paginação via `meta`).

### Formato Padrão de Paginação
Rotas de listagem (GET plural) retornam a seguinte estrutura de paginação (sujeito à configuração de middlewares globais):
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "pages": 10,
    "limit": 10
  }
}
```
*Parâmetros de Query aceitos na maioria das listagens:* `?page=1&limit=10`

---

## 1. Usuários e Autenticação (`/users`)

### Autenticação Pública
- **POST** `/users/auth/register`
  - **Body:** `{ "email": "user@email.com", "password": "123", "name": "Nome" }`
  - **Retorno:** `{ "token": "jwt_token_aqui" }`

- **POST** `/users/auth/login`
  - **Body:** `{ "email": "user@email.com", "password": "123" }`
  - **Retorno:** `{ "token": "jwt_token_aqui" }`

### Recuperação de Senha
- **POST** `/users/auth/password-reset/request`
  - **Body:** `{ "email": "user@email.com" }`
  - **Retorno:** `{ "success": true, "message": "...", "expiresIn": 15 }`
- **POST** `/users/auth/password-reset/verify`
  - **Body:** `{ "email": "user@email.com", "code": "123456" }`
  - **Retorno:** `{ "success": true, "message": "..." }`
- **POST** `/users/auth/password-reset/confirm`
  - **Body:** `{ "email": "user@email.com", "code": "123456", "newPassword": "nova_senha" }`
  - **Retorno:** `{ "success": true, "message": "..." }`

### Perfil do Usuário Logado
- **GET** `/users/me/details`
  - **Retorno:** Objeto completo do usuário autenticado.
- **PATCH** `/users/me/profile`
  - **Body:** `{ "name": "Novo Nome", "description": "Bio", "cpfOrRg": "000.000.000-00" }`
- **PATCH** `/users/me/profile/avatar`
  - **Content-Type:** `multipart/form-data`
  - **Body:** `image` (Arquivo binário)
  - **Retorno:** `{ "url": "https://...", "user": {...}, "compression": {...} }`

### Gerenciamento de Usuários (Admin)
- **GET** `/users`
  - **Query:** `?page=1&limit=10&returnType=minimum|full`
- **GET** `/users/:userID`
- **PATCH** `/users/:userID`
  - **Body:** Atualização flexível de campos (exceto senha e metadados sensíveis).
- **DELETE** `/users/:userID`

---

## 2. Recursos Humanos (`/hr/members`)
Gerencia membros e cooperados sob monitoramento do RH.

- **POST** `/hr/members`
  - **Body:** `{ "name": "Nome", "cpfOrRg": "000.000.000-00", "email": "opcional@email.com", "status": "registered", "hrControl": { "familyMembers": 2, "address": "Rua X", "phone": "1199999999" } }`
- **GET** `/hr/members` (Paginado)
- **GET** `/hr/members/:id`
- **PATCH** `/hr/members/:id`
- **DELETE** `/hr/members/:id`

---

## 3. Agricultura

### Produtos (`/agriculture/products`)
- **POST** `/agriculture/products`
  - **Body:** `{ "name": "Soja", "active": true }` (Unidade sempre forçada para 'kg')
- **GET** `/agriculture/products` (Paginado)
- **GET** `/agriculture/products/:id`
- **PATCH** `/agriculture/products/:id`
- **DELETE** `/agriculture/products/:id`

### Produções (`/agriculture/productions`)
- **POST** `/agriculture/productions`
  - **Body:** `{ "referenceYear": 2026, "productionArea": 15.5, "quantity": 1000, "plantingSeason": "Verão", "harvestSeason": "Inverno", "producer": "id_usuario", "product": "id_produto", "active": true }`
- **GET** `/agriculture/productions` (Paginado, popula `producer` e `product`)
- **GET** `/agriculture/productions/:id`
- **PATCH** `/agriculture/productions/:id`
- **DELETE** `/agriculture/productions/:id`

---

## 4. Contratos (`/contracts`)
- **POST** `/contracts`
  - **Body:** `{ "code": "CT-001", "type": "PNAE", "contractDate": "2026-04-12T00:00:00Z", "deliveryForecast": "2026-12-31T00:00:00Z", "totalValue": 50000, "totalSalePrice": 60000 }`
  - *Types válidos:* `OTHERS`, `PNAE`, `PAA`
- **GET** `/contracts` (Paginado)
- **GET** `/contracts/:id`
- **PATCH** `/contracts/:id`
- **DELETE** `/contracts/:id`

---

## 5. Manutenção e Frota

### Frotas (`/maintenance/fleets`)
- **POST** `/maintenance/fleets`
  - **Body:** `{ "name": "Trator 01", "description": "Trator modelo X", "active": true }`
- **GET** `/maintenance/fleets` (Paginado)
- **GET** `/maintenance/fleets/:id`
- **PATCH** `/maintenance/fleets/:id`
- **DELETE** `/maintenance/fleets/:id`

### Operadores (`/maintenance/operators`)
- **POST** `/maintenance/operators`
  - **Body:** `{ "name": "João", "document": "RG 123", "active": true }`
- **GET** `/maintenance/operators` (Paginado)
- **GET** `/maintenance/operators/:id`
- **PATCH** `/maintenance/operators/:id`
- **DELETE** `/maintenance/operators/:id`

### Operações de Máquinas (`/maintenance/machine-operations`)
- **POST** `/maintenance/machine-operations`
  - **Body:** `{ "fleet": "id_fleet", "operator": "id_operator", "operationDate": "2026-04-12T00:00:00Z", "serviceDescription": "Serviço X", "hourlyRate": 150.00, "hourMeterDeparture": 100, "hourMeterArrival": 108, "hourMeterServiceStart": 101, "hourMeterServiceEnd": 107 }`
- **GET** `/maintenance/machine-operations` (Paginado)
- **GET** `/maintenance/machine-operations/monthly-dashboard`
  - **Query:** `?year=2026&month=4`
  - **Retorno:** Métricas consolidadas e operações do mês.
- **GET** `/maintenance/machine-operations/monthly-closing`
  - **Query:** `?year=2026&month=4`
  - **Retorno:** Dados formatados para fechamento mensal (totais por operador, detalhes estruturados).
- **GET** `/maintenance/machine-operations/:operationID`
- **PATCH** `/maintenance/machine-operations/:operationID`
- **DELETE** `/maintenance/machine-operations/:operationID`
- **PATCH** `/maintenance/machine-operations/:operationID/status`
  - **Body:** `{ "status": "CONSOLIDATED" }` (Status: `PENDING`, `CONSOLIDATED`, `CANCELLED`)

---

## 6. Tesouraria

### Transações (`/treasury/transactions`)
- **POST** `/treasury/transactions`
  - **Body:** `{ "title": "Pagamento X", "amount": 1000, "type": "INCOME", "date": "2026-04-12", "status": "PENDING" }`
  - *Tipos:* `INCOME`, `EXPENSE`.
- **GET** `/treasury/transactions/monthly-dashboard`
  - **Query:** `?year=2026&month=4`
  - **Retorno:** `{ "currentBalance": 5000, "monthlyMetrics": {...}, "transactions": [...] }`
- **PATCH** `/treasury/transactions/:transactionID`
- **DELETE** `/treasury/transactions/:transactionID`
- **PATCH** `/treasury/transactions/:transactionID/confirm`
  - **Ação:** Altera o status da transação para `CONFIRMED`.

### Transações Recorrentes (`/treasury/recurring-transactions`)
- **POST** `/treasury/recurring-transactions`
  - **Body:** `{ "title": "Internet", "amount": 150, "type": "EXPENSE", "frequency": "MONTHLY", "nextExecution": "2026-05-10T00:00:00Z" }`
  - *Frequências:* `CUSTOM_DAYS`, `MONTHLY`, `WEEKLY`, `YEARLY`, `DAILY`.
- **GET** `/treasury/recurring-transactions` (Paginado)
- **PATCH** `/treasury/recurring-transactions/:transactionID`
- **DELETE** `/treasury/recurring-transactions/:transactionID`

### Cofres/Reservas (`/treasury/vaults`)
- **POST** `/treasury/vaults`
  - **Body:** `{ "name": "Fundo de Emergência", "goal": 10000, "description": "Reserva" }`
- **GET** `/treasury/vaults` (Paginado)
- **GET** `/treasury/vaults/:vaultID`
  - **Query:** `?page=1&limit=10`
  - **Retorno:** Retorna o objeto do cofre e um array com seu histórico de transações.
- **PATCH** `/treasury/vaults/:vaultID`
- **POST** `/treasury/vaults/:vaultID/transactions`
  - **Body:** `{ "amount": 500, "type": "DEPOSIT", "description": "Aporte mensal" }`
  - *Tipos:* `DEPOSIT`, `WITHDRAWAL` (Gera reflexo automático em `/treasury/transactions`).

---

## 7. Comunicações e Emails (`/communications/emails`)

### Templates
- **POST** `/communications/emails/templates`
  - **Body:** `{ "trigger": "MEU_GATILHO", "subject": "Assunto", "markdownBody": "# Olá {{nome}}", "variables": ["nome"], "active": true }`
- **GET** `/communications/emails/templates`
  - **Query:** `?active=true&page=1&limit=20`
- **GET** `/communications/emails/templates/:templateID` (Aceita ID do Mongo ou a string do Trigger)
- **PATCH** `/communications/emails/templates/:templateID`
- **DELETE** `/communications/emails/templates/:templateID`
- **POST** `/communications/emails/templates/seed-initial`
  - **Ação:** Cria templates padrão essenciais no banco de dados.

### Disparos
- **POST** `/communications/emails/deliveries/bulk`
  - **Body:** `{ "trigger": "GATILHO", "recipients": [ { "email": "a@a.com", "variables": { "nome": "A" } } ], "variables": { "globalVar": "123" } }`
- **POST** `/communications/emails/deliveries/broadcast`
  - **Body:** `{ "trigger": "GATILHO", "variables": { "content": "Mensagem para todos" } }`

---

## 8. Logs e Sistema (`/system/logs`)

- **GET** `/system/logs/users/me/activity`
  - **Query:** `?page=1&limit=20&action=A&startDate=ISO&endDate=ISO`
- **GET** `/system/logs/entities/:entityID/history`
  - **Query:** `?page=1&limit=20&action=A&startDate=ISO&endDate=ISO`
- **GET** `/system/logs/actions/:actionName/records`
  - **Query:** `?page=1&limit=20&startDate=ISO&endDate=ISO&entity=E`
- **GET** `/system/logs/system/activity-overview`
  - **Query:** `?hours=24`
  - **Retorno:** Métricas do painel de monitoramento do sistema.
- **GET** `/system/logs/system/error-reports`
  - **Query:** Paginado + Data Filter.
- **GET** `/system/logs/system/statistics`
  - **Query:** `?startDate=ISO&endDate=ISO`
- **GET** `/system/logs/system/all-records`
  - **Query:** Busca genérica e livre sobre logs.

---

## 9. TI e Suporte (`/it/tickets`)

- **POST** `/it/tickets`
  - **Body:** `{ "title": "Problema no e-mail", "description": "Não recebo e-mails externos", "priority": "MEDIUM" }`
  - *Prioridades:* `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.
- **GET** `/it/tickets` (Paginado)
- **GET** `/it/tickets/:id`
- **PATCH** `/it/tickets/:id`
  - **Body:** `{ "status": "ANALYSIS", "assignedTo": "id_usuario", "resolutionNotes": "Verificando logs do servidor" }`
  - *Status:* `OPEN`, `ANALYSIS`, `WAITING_USER`, `INTERVENTION`, `TESTING`, `VALIDATION`, `CLOSED`.
- **DELETE** `/it/tickets/:id`

---

## 10. Marketing (`/marketing/requests`)

- **POST** `/marketing/requests`
  - **Body:** `{ "title": "Campanha de Inverno", "description": "Divulgar novos produtos do setor" }`
- **GET** `/marketing/requests` (Paginado)
- **GET** `/marketing/requests/:id`
- **PATCH** `/marketing/requests/:id`
  - **Body:** Atualização flexível (strategy, content, feedbackNotes).
- **DELETE** `/marketing/requests/:id`

### Fluxo de Aprovação
- **POST** `/marketing/requests/:id/send-approval`
  - **Ação:** Altera o status para `WAITING_APPROVAL`.
- **POST** `/marketing/requests/:id/review`
  - **Body:** `{ "approved": true, "feedbackNotes": "Conteúdo excelente." }`
  - **Ação:** Define o status como `APPROVED` ou `REVISION_REQUIRED`.