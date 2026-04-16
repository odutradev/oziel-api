# API Documentation - Oziel Cooperativa

## Informações Gerais e Configuração de Frontend

- **Prefixo de Rota:** Todas as requisições devem apontar para a raiz da API configurada no Express, com o prefixo da versão atual (ex: `baseURL: 'https://api.dominio.com/v1'`).
- **Headers Padrão:** - `Content-Type: application/json` (Exceto em rotas de upload de arquivos que utilizam `multipart/form-data`).
  - `Authorization: Bearer <seu_token_jwt>` (Necessário para todas as rotas restritas).
- **Tratamento de Erros:** A API retornará objetos padronizados através do middleware de erro. Espere status HTTP adequados (`400`, `401`, `403`, `404`, `500`) e mensagens estruturadas (ex: `invalid_params`, `data_not_found`, `invalid_credentials`).

### Formato Padrão de Paginação
As requisições do tipo `GET` que retornam listas (paginadas) adotam sempre a seguinte estrutura no frontend:

```json
{
  "data": [ ... ],
  "meta": {
    "total": 100,
    "page": 1,
    "pages": 10,
    "limit": 10
  }
}
```
*Queries suportadas nativamente:* `?page=1&limit=10`

---

## 1. Usuários e Autenticação (`/users`)

### Autenticação Pública (Sem Token)
- **POST** `/users/auth/register`
  - **Payload:** `{ "email": "user@email.com", "password": "123", "name": "Nome Completo" }`
  - **Retorno:** `{ "token": "jwt_token_aqui" }` (Status inicial do usuário é `loggedIn`).
- **POST** `/users/auth/login`
  - **Payload:** `{ "email": "user@email.com", "password": "123" }`
  - **Retorno:** `{ "token": "jwt_token_aqui" }`

### Recuperação de Senha (Sem Token)
- **POST** `/users/auth/password-reset/request`
  - **Payload:** `{ "email": "user@email.com" }`
  - **Retorno:** `{ "success": true, "message": "...", "expiresIn": 15 }` (Envia código 6 dígitos).
- **POST** `/users/auth/password-reset/verify`
  - **Payload:** `{ "email": "user@email.com", "code": "123456" }`
  - **Retorno:** `{ "success": true, "message": "..." }`
- **POST** `/users/auth/password-reset/confirm`
  - **Payload:** `{ "email": "user@email.com", "code": "123456", "newPassword": "nova_senha" }`
  - **Retorno:** `{ "success": true, "message": "..." }`

### Perfil do Usuário Logado
- **GET** `/users/me/details`
  - **Retorno:** Objeto completo da model de usuário logado (exclui `password`).
- **PATCH** `/users/me/profile`
  - **Payload (Opcionais):** `{ "name": "Novo Nome", "description": "Bio", "cpfOrRg": "00000000000" }`
  - *Regra:* O campo `cpfOrRg` é validado automaticamente (Valida CPF ou RG válido).
- **PATCH** `/users/me/profile/avatar`
  - **Headers:** `Content-Type: multipart/form-data`
  - **Payload:** `image` (Arquivo binário `jpeg`, `png` ou `webp`).
  - **Retorno:** `{ "url": "...", "user": {...}, "compression": {...} }` (A API comprime automaticamente via `sharp`).

### Gerenciamento de Usuários (Requer Admin/Roles)
- **GET** `/users`
  - **Queries:** `?page=1&limit=10&returnType=minimum|full` (Se `minimum`, retorna apenas `_id`, `name` e `email`).
- **GET** `/users/:userID`
- **PATCH** `/users/:userID`
  - **Payload:** Flexível. Pode alterar `name`, `cpfOrRg`, `description`, `role`, `status`.
- **DELETE** `/users/:userID`

---

## 2. Recursos Humanos - Cooperados/Membros (`/hr/members`)
Os membros do RH são entidades da coleção de usuários, porém marcados com `"hrControl.isMonitored": true`.

- **POST** `/hr/members`
  - **Payload Obrigatório:** `name`, `cpfOrRg` (deve ser válido).
  - **Payload Opcional:** `email`, `status`, `hrControl: { familyMembers: 2, address: "Rua", phone: "1199999" }`.
- **GET** `/hr/members` (Paginado)
- **GET** `/hr/members/:id`
- **PATCH** `/hr/members/:id`
  - **Payload:** Flexível (atualiza `name`, `cpfOrRg`, `hrControl.familyMembers`, `hrControl.address`, `hrControl.phone`).
- **DELETE** `/hr/members/:id`

---

## 3. Agricultura

### Produtos (`/agriculture/products`)
- **POST** `/agriculture/products`
  - **Payload Obrigatório:** `name`.
  - **Payload Opcional:** `active` (padrão `true`). A unidade (`unit`) é forçada pelo backend para `"kg"`.
- **GET** `/agriculture/products` (Paginado)
- **GET** `/agriculture/products/:id`
- **PATCH** `/agriculture/products/:id`
- **DELETE** `/agriculture/products/:id`

### Produções (`/agriculture/productions`)
- **POST** `/agriculture/productions`
  - **Payload Obrigatório:** `referenceYear` (number), `productionArea` (number), `quantity` (number), `producer` (ID do usuário membro do RH), `product` (ID do produto).
  - **Payload Opcional:** `plantingSeason`, `harvestSeason`, `active`.
- **GET** `/agriculture/productions`
  - *Detalhe:* A listagem popula automaticamente os campos `producer (name, cpfOrRg)` e `product (name, unit)`.
- **GET** `/agriculture/productions/:id`
- **PATCH** `/agriculture/productions/:id`
- **DELETE** `/agriculture/productions/:id`

---

## 4. Contratos (`/contracts`)
- **POST** `/contracts`
  - **Payload Obrigatório:** `code`, `type` (`OTHERS`, `PNAE`, `PAA`), `contractDate` (Data ISO), `deliveryForecast` (Data ISO), `totalValue` (number), `totalSalePrice` (number).
- **GET** `/contracts` (Paginado)
- **GET** `/contracts/:id`
- **PATCH** `/contracts/:id`
  - **Nota:** O `code` deve permanecer único. O `status` pode ser atualizado para `ACTIVE`, `INACTIVE`, `REGULAR`, `IRREGULAR`.
- **DELETE** `/contracts/:id`

---

## 5. Manutenção e Frota

### Frotas (`/maintenance/fleets`)
- **POST** `/maintenance/fleets`
  - **Payload Obrigatório:** `name`.
  - **Payload Opcional:** `description`, `active`.
- **GET** `/maintenance/fleets` (Paginado)
- **GET** `/maintenance/fleets/:id`
- **PATCH** `/maintenance/fleets/:id`
- **DELETE** `/maintenance/fleets/:id`

### Operadores (`/maintenance/operators`)
- **POST** `/maintenance/operators`
  - **Payload Obrigatório:** `name`.
  - **Payload Opcional:** `document`, `active`.
- **GET** `/maintenance/operators` (Paginado)
- **GET** `/maintenance/operators/:id`
- **PATCH** `/maintenance/operators/:id`
- **DELETE** `/maintenance/operators/:id`

### Operações de Máquinas (`/maintenance/machine-operations`)
- **POST** `/maintenance/machine-operations`
  - **Payload Obrigatório:** `fleet` (ID), `operator` (ID), `operationDate` (Data ISO), `hourlyRate` (number), `serviceDescription` (ou `description`).
  - **Cálculo Automático no Backend:** A API calcula `totalHours` (chegada - saída), `workedHours` (fim do serviço - início do serviço) e `totalValue` (`workedHours * hourlyRate`).
  - **Payload Opcional:** `hourMeterDeparture`, `hourMeterArrival`, `hourMeterServiceStart`, `hourMeterServiceEnd`, `fuelDepartureLiters`, `fuelConsumptionLiters`.
- **GET** `/maintenance/machine-operations` (Paginado. Popula Frota e Operador).
- **GET** `/maintenance/machine-operations/monthly-dashboard`
  - **Queries Obrigatórias:** `?year=2026&month=4`
  - **Retorno:** `{ metrics: { totalWorkedHours, totalRevenue, pendingRevenue, consolidatedRevenue }, operations: [...] }`
- **GET** `/maintenance/machine-operations/monthly-closing`
  - **Queries Obrigatórias:** `?year=2026&month=4`
  - **Retorno:** Relatório de fechamento com os campos `{ period, details, totals, operatorTotals }`. Usado para exportação (PDF/Excel) no frontend.
- **GET** `/maintenance/machine-operations/:operationID`
- **PATCH** `/maintenance/machine-operations/:operationID`
- **DELETE** `/maintenance/machine-operations/:operationID`
- **PATCH** `/maintenance/machine-operations/:operationID/status`
  - **Payload:** `{ "status": "CONSOLIDATED" }` (Aceita `PENDING`, `CONSOLIDATED`, `CANCELLED`).

---

## 6. Tesouraria

### Transações Correntes (`/treasury/transactions`)
- **POST** `/treasury/transactions`
  - **Payload Obrigatório:** `title`, `amount` (number absoluto), `type` (`INCOME`, `EXPENSE`), `date` (Data ISO).
  - **Payload Opcional:** `status` (padrão `PENDING`), `description`, `category`.
- **GET** `/treasury/transactions/monthly-dashboard`
  - **Queries Obrigatórias:** `?year=2026&month=4`
  - **Retorno:** `{ currentBalance: (INCOME total - EXPENSE total de tudo confirmado), monthlyMetrics: { income, expense, pendingIncome, pendingExpense, balance }, transactions: [...] }`
- **PATCH** `/treasury/transactions/:transactionID`
- **DELETE** `/treasury/transactions/:transactionID`
- **PATCH** `/treasury/transactions/:transactionID/confirm`
  - **Ação:** Confirma a transação (altera para `CONFIRMED`).

### Transações Recorrentes (`/treasury/recurring-transactions`)
- **POST** `/treasury/recurring-transactions`
  - **Payload Obrigatório:** `title`, `amount`, `type`, `frequency` (`CUSTOM_DAYS`, `MONTHLY`, `WEEKLY`, `YEARLY`, `DAILY`), `nextExecution` (Data ISO).
  - **Payload Opcional:** `dayOfMonth`, `intervalDays`, `active`, `category`, `description`.
- **GET** `/treasury/recurring-transactions` (Paginado, ordenado pela próxima execução).
- **PATCH** `/treasury/recurring-transactions/:transactionID`
- **DELETE** `/treasury/recurring-transactions/:transactionID`

### Cofres / Reservas (`/treasury/vaults`)
- **POST** `/treasury/vaults`
  - **Payload Obrigatório:** `name`.
  - **Payload Opcional:** `goal`, `description`. (Saldo é iniciado em 0).
- **GET** `/treasury/vaults` (Paginado).
- **GET** `/treasury/vaults/:vaultID`
  - **Queries:** `?page=1&limit=10`
  - **Retorno:** `{ vault: {...}, transactions: [...], meta: {...} }` (Retorna a entidade cofre e o histórico de transações vinculadas).
- **PATCH** `/treasury/vaults/:vaultID`
- **POST** `/treasury/vaults/:vaultID/transactions`
  - **Payload Obrigatório:** `amount` (number positivo), `type` (`DEPOSIT`, `WITHDRAWAL`).
  - **Payload Opcional:** `description`.
  - **Ação Interna:** Além de atualizar o saldo do cofre, esta rota cria de forma transparente e automática uma transação (`INCOME` ou `EXPENSE`) em `/treasury/transactions` como compensação financeira global, com o status consolidado (`CONFIRMED`).

---

## 7. Comunicações e Emails (`/communications/emails`)

### Gestão de Templates
- **POST** `/communications/emails/templates`
  - **Payload Obrigatório:** `trigger` (string de ativação, ex: `MEU_NOVO_GATILHO`), `subject`, `markdownBody` (corpo com sintaxe markdown e variáveis {{var}}).
  - **Payload Opcional:** `variables` (array de strings), `description`, `active`.
- **GET** `/communications/emails/templates`
  - **Queries:** `?page=1&limit=20&active=true`
- **GET** `/communications/emails/templates/:templateID` (Pode buscar pelo `_id` do MongoDB ou pela string do `trigger`).
- **PATCH** `/communications/emails/templates/:templateID`
- **DELETE** `/communications/emails/templates/:templateID`
- **POST** `/communications/emails/templates/seed-initial`
  - **Ação:** Cria automaticamente todos os templates nativos do sistema se eles não existirem (ex: PASSWORD_RESET).

### Disparos Específicos
- **POST** `/communications/emails/deliveries/bulk`
  - **Payload Obrigatório:** `trigger` (nome do gatilho configurado), `recipients` (array contendo objetos `{ email: "x", variables: { nome: "A" } }`).
  - **Payload Opcional:** `variables` (Objeto genérico para ser repassado a todos os e-mails).
- **POST** `/communications/emails/deliveries/broadcast`
  - **Ação:** Dispara para TODOS os usuários ativos cadastrados no banco.
  - **Payload Obrigatório:** `trigger`.
  - **Payload Opcional:** `variables` (As tags automáticas `{{userName}}` e `{{userEmail}}` são injetadas no loop por padrão).

---

## 8. Logs, Atividades e Sistema (`/system/logs`)

### Leituras de Histórico
- **GET** `/system/logs/users/me/activity`
  - **Queries (Opcionais):** `page`, `limit`, `action`, `startDate`, `endDate`.
- **GET** `/system/logs/entities/:entityID/history`
  - **Queries (Opcionais):** Mesmas da rota acima. Busca histórico de uma entidade (usuário ou sistema).
- **GET** `/system/logs/actions/:actionName/records`
  - **Queries (Opcionais):** Mesmas da rota acima, mais a query `entity` (ex: "user" ou "system"). Busca histórico por tipo de ação.

### Visões do Sistema (Dashboards de Monitoramento)
- **GET** `/system/logs/system/activity-overview`
  - **Queries (Opcional):** `?hours=24` (intervalo de horas a observar).
  - **Retorno:** Visão geral contendo array de timeline de atividades por hora, lista de ações, top usuários ativos e log de erros recentes (`{ period, recentActivity, activityByHour, activityByAction, activeUsers, systemErrors, summary }`).
- **GET** `/system/logs/system/statistics`
  - **Queries (Opcionais):** `startDate`, `endDate` (ISO).
  - **Retorno:** Estatísticas massivas como distribuição por ação e entidade, métricas gerais, atividades por dia de forma aglutinada (`{ period, overview, byAction, byEntity, byUser, timeline, topUsers }`).
- **GET** `/system/logs/system/error-reports`
  - **Retorno:** Lista de logs apenas contendo palavras de erro, ideal para monitoramento reativo. Usa paginação e filtros de data.
- **GET** `/system/logs/system/all-records`
  - **Queries (Opcionais):** `page`, `limit`, `action`, `entity`, `userID`, `startDate`, `endDate`. Busca bruta em todos os logs sem agrupamento pesado.

---

## 9. TI e Tickets (`/it/tickets`)

- **POST** `/it/tickets`
  - **Payload Obrigatório:** `title`, `description`. (O sistema atrela automaticamente o `requester` ao usuário logado no JWT).
  - **Payload Opcional:** `priority` (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), `status` (`OPEN`, `ANALYSIS`, `WAITING_USER`, `INTERVENTION`, `TESTING`, `VALIDATION`, `CLOSED`).
- **GET** `/it/tickets` (Paginado. Popula `requester` e `assignedTo`).
- **GET** `/it/tickets/:id`
- **PATCH** `/it/tickets/:id`
  - **Payload:** Qualquer campo da entidade. Ideal para designar técnico (`assignedTo`) ou incluir notas (`resolutionNotes`).
- **DELETE** `/it/tickets/:id`

---

## 10. Marketing e Campanhas (`/marketing/requests`)

- **POST** `/marketing/requests`
  - **Payload Obrigatório:** `title`, `description`.
  - **Criação Interna:** `requester` definido automaticamente, status inicial `REQUESTED`.
- **GET** `/marketing/requests` (Paginado. Popula `requester` e `approvedBy`).
- **GET** `/marketing/requests/:id`
- **PATCH** `/marketing/requests/:id`
  - **Payload:** Atualização flexível em fluxos parciais (pode alterar `strategy`, `content`, `results`).

### Fluxo Específico de Aprovação
- **POST** `/marketing/requests/:id/send-approval`
  - **Ação:** Altera instantaneamente o status do artefato para `WAITING_APPROVAL`. Não requer body.
- **POST** `/marketing/requests/:id/review`
  - **Payload Obrigatório:** `{ "approved": true }` (boolean).
  - **Payload Opcional:** `{ "feedbackNotes": "Texto de revisão" }`.
  - **Ação:** Dependendo do booleano de aprovação, atribui o ID do aprovador e muda o status para `APPROVED` ou reverte para `REVISION_REQUIRED`.