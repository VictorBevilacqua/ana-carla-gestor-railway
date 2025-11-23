# 🚀 Ana Carla ERP - Como Usar

## ✅ Status Atual: PROJETO FUNCIONANDO!

### 📍 URLs de Acesso

- **Frontend (Interface Web)**: http://localhost:8081 ← **ACESSE ESTE NO NAVEGADOR**
- **Backend API**: http://localhost:8080
- **Swagger (Documentação da API)**: http://localhost:8080/swagger-ui.html
- **PostgreSQL Database**: localhost:5432

### 🔐 Credenciais do Banco de Dados

- **Database**: `anacarla_erp`
- **Usuário**: `anacarla`
- **Senha**: `anacarla123`

### 🎯 Iniciar o Projeto

Para iniciar tudo (PostgreSQL + Backend + Frontend):

```powershell
cd ana-carla-erp
docker-compose up -d
```

Aguarde ~20 segundos para o backend iniciar completamente.

Depois, em **outro terminal**, inicie o frontend:

```powershell
cd ..\ana-carla-gestor-main\ana-carla-gestor-main
npm run dev
```

### 🛑 Parar o Projeto

Para parar o PostgreSQL e o Backend:

```powershell
cd ana-carla-erp
docker-compose down
```

Para parar o frontend, pressione `Ctrl+C` no terminal onde ele está rodando.

### 📦 Gerenciar Containers Docker

Ver containers rodando:
```powershell
docker ps
```

Ver logs do backend:
```powershell
docker logs anacarla-erp
```

Ver logs do PostgreSQL:
```powershell
docker logs anacarla-postgres
```

Reiniciar apenas o backend:
```powershell
docker restart anacarla-erp
```

### 🔄 Rebuild Completo

Se fizer mudanças no código do backend:

```powershell
cd ana-carla-erp
docker-compose down
docker-compose up -d --build
```

### 📊 Acessar o Banco de Dados Diretamente

Usando PostgreSQL Client:
```powershell
docker exec -it anacarla-postgres psql -U anacarla -d anacarla_erp
```

### ⚠️ Troubleshooting

**Backend não inicia:**
- Verifique se o PostgreSQL está rodando: `docker ps`
- Veja os logs: `docker logs anacarla-erp`

**Frontend não conecta:**
- Verifique se o backend está rodando em http://localhost:8080
- Veja o console do navegador para erros

**Porta em uso:**
- Backend (8080), Frontend (8081), ou PostgreSQL (5432) já estão em uso
- Mude as portas em `docker-compose.yml` (backend/PostgreSQL) ou `vite.config.ts` (frontend)

### 🎉 Pronto para usar!

Acesse **http://localhost:8081** no seu navegador e comece a usar o sistema!

