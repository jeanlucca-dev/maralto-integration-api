# Maralto Integration API

> API REST de integração entre **ViaHub** e **MAXIS** — sistemas internos da Maralto Tecnologia.

## Sobre o projeto

Este projeto implementa uma camada de integração (bridge) entre dois sistemas da Maralto Tecnologia:

- **ViaHub** — plataforma B2B SaaS para agências de viagem (frontend do cliente)
- **MAXIS** (Maralto Integrated System) — sistema interno de gestão da Maralto (backoffice)

A API permite que tickets de suporte abertos no ViaHub sejam tratados no MAXIS, clientes sejam sincronizados entre os sistemas, e notificações de orçamentos fluam bidirecionalmente.

## Stack

| Tecnologia | Uso |
|---|---|
| Node.js + TypeScript | Runtime e linguagem |
| Express | Framework HTTP |
| Supabase | Backend (PostgreSQL + Auth) |
| Zod | Validação de schemas |
| Vitest | Testes |
| Helmet + CORS | Segurança |

## Arquitetura

```
ViaHub (SaaS)           Integration API           MAXIS (Backoffice)
┌──────────┐           ┌──────────────┐           ┌──────────┐
│ Frontend │──────────▶│  /api/v1/*   │──────────▶│ Supabase │
│ Supabase │◀──────────│  Express     │◀──────────│ Database │
│ tupzq... │           │  Bridge      │           │ bxpxl... │
└──────────┘           └──────────────┘           └──────────┘
```

## Endpoints

### Públicos

| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Info da API |
| GET | `/health` | Status e conectividade |

### Protegidos (requer `x-api-key`)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/v1/tickets` | Criar ticket (ViaHub → MAXIS) |
| GET | `/api/v1/tickets/:id/messages` | Mensagens do ticket |
| POST | `/api/v1/tickets/reply` | Resposta do cliente |
| POST | `/api/v1/clients/sync` | Sincronizar cliente |
| GET | `/api/v1/clients/mapping/:viahubId` | Buscar mapeamento |
| GET | `/api/v1/clients/mappings` | Listar mapeamentos |

## Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/maralto-integration-api.git
cd maralto-integration-api

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

## Variáveis de ambiente

Veja `.env.example` para a lista completa. As principais são:

- `VIAHUB_SUPABASE_URL` / `VIAHUB_SUPABASE_SERVICE_KEY` — conexão com o ViaHub
- `MAXIS_SUPABASE_URL` / `MAXIS_SUPABASE_SERVICE_KEY` — conexão com o MAXIS
- `API_SECRET` — chave para autenticação dos endpoints
- `ALLOWED_ORIGINS` — domínios permitidos (CORS)

## Testes

```bash
npm test
```

## Estrutura do projeto

```
src/
├── config/          # Configuração (env, supabase clients)
├── middleware/       # Auth, error handling
├── routes/          # Rotas Express (tickets, clients, health)
├── services/        # Lógica de negócio
├── types/           # Tipos TypeScript
├── utils/           # Validações (Zod schemas)
├── app.ts           # Setup Express
└── server.ts        # Entry point
tests/
└── validators.test.ts
```

## Autor

**Jean** — Maralto Tecnologia  
Disciplina: Análise e Desenvolvimento de Sistemas — PUCPR

## Licença

Proprietário — Maralto Tecnologia da Informação e Serviços Digitais LTDA
