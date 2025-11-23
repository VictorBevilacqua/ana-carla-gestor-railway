# 🚀 Como Executar o Projeto Ana Carla ERP

## 📋 Pré-requisitos

- ✅ Java 21
- ✅ Node.js 18+
- ✅ npm ou yarn

---

## 🔧 1. BACKEND (Spring Boot)

### Abra o PowerShell e execute:

```powershell
cd "C:\Users\felip\OneDrive\Documentos\PROJETO 2 SEMESTRE\ana-carla-erp"
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
.\mvnw.cmd spring-boot:run
```

### ✅ Backend estará rodando em:
- **API**: http://localhost:8080
- **Swagger**: http://localhost:8080/swagger-ui.html
- **H2 Console**: http://localhost:8080/h2-console

### 🔐 Credenciais criadas automaticamente:
- **Email**: `admin@anacarla.com.br`
- **Senha**: `admin123`

---

## 🎨 2. FRONTEND (React + Vite)

### Em um NOVO PowerShell (mantendo o backend rodando), execute:

```powershell
cd "C:\Users\felip\OneDrive\Documentos\PROJETO 2 SEMESTRE\ana-carla-gestor-main\ana-carla-gestor-main"
npm install
npm run dev
```

### ✅ Frontend estará em:
- **URL**: http://localhost:5173 (ou a porta indicada)

---

## 📝 3. TESTANDO A CONEXÃO

### 1. Acesse o frontend (http://localhost:5173)
### 2. Você verá a tela de LOGIN
### 3. Use as credenciais:
   - Email: `admin@anacarla.com.br`
   - Senha: `admin123`

### 4. Após o login, você terá acesso completo ao ERP!

---

## 🔄 Fluxo Completo

```
Frontend (React)  →  Backend (Spring Boot)  →  Banco H2 (Memória)
  :5173                    :8080                  
```

---

## 🛠️ Troubleshooting

### Backend não inicia?
- Verifique se o Java 21 está instalado: `java -version`
- Certifique-se de usar `$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"`

### Frontend não conecta?
- Verifique se o backend está rodando (http://localhost:8080/actuator/health)
- Abra o DevTools (F12) e veja se há erros de CORS

### Erro de Login?
- Verifique se o usuário foi criado (veja os logs do backend)
- O backend cria o usuário automaticamente na inicialização

---

## 🎯 Endpoints Principais

### Autenticação
```
POST /auth/login
Body: { "email": "admin@anacarla.com.br", "senha": "admin123" }
```

### Clientes
```
GET    /clientes
POST   /clientes
PUT    /clientes/{id}
DELETE /clientes/{id}
```

### Cardápio
```
GET    /cardapio
POST   /cardapio
PATCH  /cardapio/{id}/ativo
GET    /cardapio/whatsapp-text
```

### Pedidos
```
GET    /pedidos
POST   /pedidos
PATCH  /pedidos/{id}/status
GET    /pedidos/kanban
```

---

## 📚 Documentação Completa

Acesse o **Swagger UI** para ver todos os endpoints:
http://localhost:8080/swagger-ui.html

---

## ✅ Pronto!

Agora você tem:
- ✅ Backend Spring Boot rodando
- ✅ Frontend React rodando
- ✅ Sistema completo integrado
- ✅ Autenticação JWT funcionando
- ✅ Banco de dados H2 em memória

