# API de Agendamento RESTful

API robusta para agendamento de serviços desenvolvida com **Node.js**, **Express** e **PostgreSQL**, executada nativamente em ambiente **Termux**. O sistema conta com controle de concorrência relacional para impedir choque de horários e autenticação stateless via JWT.

## 🚀 Tecnologias

- **Runtime**: Node.js
- **Framework**: Express.js
- **Banco de Dados**: PostgreSQL (com driver `pg` e pool de conexões)
- **Autenticação**: JSON Web Tokens (`jsonwebtoken`)
- **Segurança**: Criptografia de senhas com `bcryptjs`
- **Ambiente**: Termux (Android Linux Subsystem)

---

## 🔒 Arquitetura & Regras de Negócio

1. **Autenticação Stateless**: Rotas privadas são protegidas pelo `authMiddleware`, exigindo o cabeçalho `Authorization: Bearer <TOKEN>`.
2. **Controle de Concorrência (Overlap)**: Prevenção de agendamentos sobrepostos no banco de dados através da validação temporal:
   $$\text{A}_{inicio} < \text{B}_{fim} \quad \text{AND} \quad \text{A}_{fim} > \text{B}_{inicio}$$
3. **Gerenciamento de Estados**: Cancelamentos alteram o status para `cancelado`, liberando instantaneamente o slot para novas marcações.

---

## 🛠️ Endpoints

### Autenticação
- `POST /api/usuarios` — Cadastro de usuário
- `POST /api/login` — Autenticação e geração de JWT

### Agendamentos (Requer JWT)
- `POST /api/agendamentos` — Cria um novo agendamento (valida conflito de horários)
- `GET /api/agendamentos` — Lista agendamentos (suporta query params `?inicio=ISO&fim=ISO`)
- `PATCH /api/agendamentos/:id/cancelar` — Cancela um agendamento e libera o horário

---

## 💻 Execução Local (Termux / Linux)

```bash
# Instalar dependências
npm install

# Inicializar o schema no PostgreSQL
psql -d api_agendamento -f src/database/schema.sql

# Iniciar o servidor
node server.js


