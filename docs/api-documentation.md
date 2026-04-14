# API Documentation - Oziel Cooperativa

## Informações Gerais

- **Base URL:** `/v1`
- **Content-Type Padrão:** `application/json`
- **Autenticação:** A maioria das rotas privadas requer um token JWT enviado no header `Authorization: Bearer <token>`.
- **Headers de Resposta:** Todas as respostas bem-sucedidas incluem os headers:
  - `api-database-name`
  - `api-version`
  - `api-mode`

### Formato Padrão de Paginação
Rotas de listagem (GET plural) geralmente retornam a seguinte estrutura de paginação:
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
*Parâmetros de Query aceitos nas listagens:* `?page=1&limit=10`

---

## 1. Autenticação e Perfil (`/v1/users`)

### Autenticação
- **POST** `/auth/register`
  - **Body:** `{ "email": "user@email.com", "password": "123", "name": "Nome" }`
  - **Retorno:** `{ "token": "jwt_token_aqui" }`

- **POST** `/auth/login`
  - **Body:** `{ "email": "user@email.com", "password": "123" }`
  - **Retorno:** `{ "token": "jwt_token_aqui" }`

### Recuperação de Senha
- **POST** `/auth/password-reset/request`
  - **Body:** `{ "email": "user@email.com" }`
- **POST** `/auth/password-reset/verify`
  - **Body:** `{ "email": "user@email.com", "code": "123456" }`
- **POST** `/auth/password-reset/confirm`
  - **Body:** `{ "email": "user@email.com", "code": "123456", "newPassword": "nova_senha" }`

### Perfil do Usuário Logado
- **GET** `/me/details`
  - **Retorno:** Objeto do usuário logado (sem a senha).
- **PATCH** `/me/profile`
  - **Body:** `{ "name": "Novo Nome", "description": "Bio", "cpfOrRg": "000.000.000-00" }`
- **PATCH** `/me/profile/avatar`
  - **Content-Type:** `multipart/form-data`
  - **Body:** `image` (Arquivo)
  - **Retorno:** `{ "url": "https://...", "user": {...}, "compression": {...} }`

### Gerenciamento de Usuários (Admin)
- **GET** `/` (Aceita `?returnType=minimum` para retorno resumido)
- **GET** `/:userID`
- **PATCH** `/:userID`
- **DELETE** `/:userID`

---

## 2. Recursos Humanos (`/v1/hr/members`)
Gerencia usuários específicos monitorados pelo RH.

- **POST** `/`
  - **Body:** `{ "name": "Nome", "cpfOrRg": "000.000.000-00", "email": "opcional", "hrControl": { "familyMembers": 2, "address": "Rua X", "phone": "1199999999" } }`
- **GET** `/` (Paginado)
- **GET** `/:id`
- **PATCH** `/:id`
- **DELETE** `/:id`

---

## 3. Manutenção e Frota

### Frotas (`/v1/maintenance/fleets`)
- **POST** `/`
  - **Body:** `{ "name": "Trator 01", "description": "Trator modelo X", "active": true }`
- **GET** `/` (Paginado)
- **GET** `/:id`
- **PATCH** `/:id`
- **DELETE** `/:id`

### Operadores (`/v1/maintenance/operators`)
- **POST** `/`
  - **Body:** `{ "name": "João", "document": "RG 123", "active": true }`
- **GET** `/` (Paginado)
- **GET** `/:id`
- **PATCH** `/:id`
- **DELETE** `/:id`

### Operações de Máquinas (`/v1/maintenance/machine-operations`)
- **POST** `/`
  - **Body:** `{ "fleet": "id_fleet", "operator": "id_operator", "operationDate": "2026-04-12T00:00:00.000Z", "serviceDescription": "Serviço X", "hourlyRate": 150.00, "hourMeterDeparture": 100, "hourMeterArrival": 108, "hourMeterServiceStart": 101, "hourMeterServiceEnd": 107 }`
- **GET** `/` (Paginado)
- **GET** `/monthly-dashboard`
  - **Query:** `?year=2026&month=4`
  - **Retorno:** `{ "metrics": { "totalWorkedHours": 10, "totalRevenue": 1500, "pendingRevenue": 1500, "consolidatedRevenue": 0 }, "operations": [...] }`
- **GET** `/monthly-closing`
  - **Query:** `?year=2026&month=4`
  - **Retorno:** `{ "period": {...}, "details": [...], "totals": {...}, "operatorTotals": [...] }`
- **GET** `/:operationID`
- **PATCH** `/:operationID`
- **DELETE** `/:operationID`
- **PATCH** `/:operationID/status`
  - **Body:** `{ "status": "CONSOLIDATED" }` (Status válidos: PENDING, CONSOLIDATED, CANCELLED)

---

## 4. Tesouraria

### Transações (`/v1/treasury/transactions`)
- **POST** `/`
  - **Body:** `{ "title": "Pagamento X", "amount": 1000, "type": "INCOME", "date": "2026-04-12" }` (Tipos: INCOME, EXPENSE)
- **GET** `/monthly-dashboard`
  - **Query:** `?year=2026&month=4`
  - **Retorno:** `{ "currentBalance": 5000, "monthlyMetrics": {...}, "transactions": [...] }`
- **PATCH** `/:transactionID`
- **DELETE** `/:transactionID`
- **PATCH** `/:transactionID/confirm` (Muda status para CONFIRMED)

### Transações Recorrentes (`/v1/treasury/recurring-transactions`)
- **POST** `/`
  - **Body:** `{ "title": "Internet", "amount": 150, "type": "EXPENSE", "frequency": "MONTHLY", "nextExecution": "2026-05-10T00:00:00.000Z" }`
- **GET** `/` (Paginado)
- **PATCH** `/:transactionID`
- **DELETE** `/:transactionID`

### Cofres/Reservas (`/v1/treasury/vaults`)
- **POST** `/`
  - **Body:** `{ "name": "Fundo de Emergência", "goal": 10000, "description": "Reserva" }`
- **GET** `/` (Paginado)
- **GET** `/:vaultID` (Retorna o cofre e suas transações paginadas)
- **PATCH** `/:vaultID`
- **POST** `/:vaultID/transactions`
  - **Body:** `{ "amount": 500, "type": "DEPOSIT", "description": "Aporte mensal" }` (Tipos: DEPOSIT, WITHDRAWAL)

---

## 5. Comunicações e Emails (`/v1/communications/emails`)

### Templates
- **POST** `/templates`
  - **Body:** `{ "trigger": "NOVO_GATILHO", "subject": "Assunto", "markdownBody": "# Título\nOlá {{nome}}", "variables": ["nome"] }`
- **GET** `/templates` (Paginado)
- **GET** `/templates/:templateID` (Aceita ID ou Trigger)
- **PATCH** `/templates/:templateID`
- **DELETE** `/templates/:templateID`
- **POST** `/templates/seed-initial` (Cria templates padrão do sistema)

### Disparos
- **POST** `/deliveries/bulk`
  - **Body:** `{ "trigger": "GATILHO", "recipients": [ { "email": "a@a.com", "variables": { "nome": "A" } } ], "variables": { "globalVar": "123" } }`
- **POST** `/deliveries/broadcast`
  - **Body:** `{ "trigger": "GATILHO", "variables": { "content": "Mensagem para todos" } }`

---

## 6. Logs e Sistema (`/v1/system/logs`)

- **GET** `/users/me/activity` (Paginado)
- **GET** `/entities/:entityID/history` (Paginado)
- **GET** `/actions/:actionName/records` (Paginado)
- **GET** `/system/activity-overview`
  - **Query:** `?hours=24`
- **GET** `/system/error-reports` (Paginado)
- **GET** `/system/statistics`
  - **Query:** `?startDate=ISO&endDate=ISO`
- **GET** `/system/all-records` (Paginado)