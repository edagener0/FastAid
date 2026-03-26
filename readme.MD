# FastAid

FastAid e uma plataforma de apoio operacional para incidentes, com:

- backend em FastAPI + SQLModel
- frontend em React + Vite
- base de dados PostgreSQL
- stack completa via Docker Compose

O frontend consome a API do backend por `/api`, tanto em desenvolvimento como em Docker.

## Stack

- Backend: FastAPI, SQLModel, Uvicorn, Pydantic Settings
- Frontend: React, TypeScript, Vite, React Router, Leaflet
- Base de dados: PostgreSQL 17
- Infra: Docker, Docker Compose, GitHub Actions

## Estrutura

```text
.
├── backend
│   ├── Dockerfile
│   ├── requirements.txt
│   └── src
├── frontend/fastaid
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src
├── .github/workflows
└── docker-compose.yml
```

## Requisitos Locais

- Python 3.13
- Node.js 24+
- npm
- PostgreSQL 17

## Variaveis de Ambiente

Na raiz do projeto existe um exemplo para Docker:

```bash
cp .env.example .env
```

Para o backend local:

```bash
cp backend/.env.example backend/.env
```

Para o frontend local:

```bash
cp frontend/fastaid/.env.example frontend/fastaid/.env
```

### Backend

Exemplo em [backend/.env.example](/Users/renato/Documents/MapaTec/FastAid/backend/.env.example):

```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/fastaid
FRONTEND_BASE_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173,http://localhost:4173
GEMINI_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_SENDER_NUMBER=
```

### Frontend

Exemplo em [frontend/fastaid/.env.example](/Users/renato/Documents/MapaTec/FastAid/frontend/fastaid/.env.example):

```env
VITE_API_BASE_URL=/api
VITE_BACKEND_TARGET=http://localhost:8000
```

## Correr Localmente

### 1. Arrancar PostgreSQL

Cria uma base de dados chamada `fastaid` e ajusta o `DATABASE_URL` do backend se necessario.

### 2. Arrancar o backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd src
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

API disponivel em `http://127.0.0.1:8000`.

### 3. Arrancar o frontend

```bash
cd frontend/fastaid
npm ci
npm run dev
```

Frontend disponivel em `http://localhost:5173`.

Em desenvolvimento, o Vite faz proxy de `/api` para `VITE_BACKEND_TARGET`.

## Correr com Docker Compose

```bash
docker compose up --build -d
```

Servicos:

- frontend: `http://127.0.0.1:8080`
- backend: `http://127.0.0.1:8000`
- health via frontend/nginx: `http://127.0.0.1:8080/api/health`

Para parar:

```bash
docker compose down
```

Para remover tambem o volume da base de dados:

```bash
docker compose down -v
```

## Validacao

Comandos uteis:

```bash
python3 -m compileall backend/src
```

```bash
cd frontend/fastaid
npm run lint
npm run build
```

```bash
docker compose ps
curl http://127.0.0.1:8080/api/health
curl "http://127.0.0.1:8080/api/incidents?limit=100"
```

## CI/CD

Os workflows estao em [/.github/workflows](/Users/renato/Documents/MapaTec/FastAid/.github/workflows):

- [ci.yml](/Users/renato/Documents/MapaTec/FastAid/.github/workflows/ci.yml): instala dependencias, compila o backend e faz build do frontend
- [docker-publish.yml](/Users/renato/Documents/MapaTec/FastAid/.github/workflows/docker-publish.yml): faz build e publish das imagens para GHCR

## Notas

- O backend cria as tabelas automaticamente no arranque.
- O endpoint `GET /incidents` aceita ate `limit=100`, o que alinha com o consumo atual do frontend.
- `CORS_ORIGINS` pode ser configurado como lista separada por virgulas, conforme os ficheiros `.env.example`.
