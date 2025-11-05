# Ana Carla ERP - Backend

Sistema de gestão para Ana Carla desenvolvido em **Java 21** com **Spring Boot 3.2**.

## 🚀 Tecnologias

- **Java 21** - Linguagem de programação
- **Spring Boot 3.2** - Framework
- **Spring Data JPA** - Persistência de dados
- **Spring Security + JWT** - Autenticação e autorização
- **PostgreSQL** - Banco de dados (produção)
- **H2 Database** - Banco de dados (desenvolvimento)
- **Flyway** - Migrations
- **MapStruct** - Mapeamento de objetos
- **Caffeine** - Cache
- **Testcontainers** - Testes de integração
- **Maven** - Gerenciamento de dependências
- **Docker** - Containerização

## 📋 Pré-requisitos

- Java 21 ou superior
- Maven 3.8+
- Docker e Docker Compose (opcional, para execução containerizada)

## 🔧 Configuração

### Desenvolvimento (H2 em memória)

O projeto já vem configurado para usar H2 em memória no modo de desenvolvimento:

```bash
mvn spring-boot:run
```

A aplicação estará disponível em `http://localhost:8080`

Console H2: `http://localhost:8080/h2-console`
- URL JDBC: `jdbc:h2:mem:erp`
- User: `sa`
- Password: (deixe em branco)

### Produção (PostgreSQL)

1. Configure as variáveis de ambiente:

```bash
export SPRING_PROFILES_ACTIVE=prod
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=anacarla
export DB_USER=anacarla
export DB_PASSWORD=sua_senha_aqui
export JWT_SECRET=sua_chave_secreta_min_256_bits
```

2. Execute a aplicação:

```bash
mvn clean package
java -jar target/ana-carla-erp-1.0.0.jar
```

### Docker Compose

A maneira mais fácil de executar em produção:

```bash
docker-compose up -d
```

Isso iniciará:
- PostgreSQL na porta 5432
- Aplicação Spring Boot na porta 8080

## 📚 API

### Documentação (Swagger)

Acesse: `http://localhost:8080/swagger-ui.html`

### Endpoints Principais

#### Autenticação
- `POST /auth/login` - Login (retorna JWT)

**Credenciais padrão:**
- Email: `admin@anacarla.com.br`
- Senha: `admin123`

#### Clientes
- `GET /clientes?buscar=termo&page=0&size=20` - Listar clientes
- `POST /clientes` - Criar cliente
- `GET /clientes/{id}` - Buscar cliente
- `PUT /clientes/{id}` - Atualizar cliente
- `GET /clientes/{id}/metricas` - Métricas do cliente
- `GET /clientes/{id}/interacoes` - Interações do cliente
- `POST /clientes/{id}/tarefas` - Criar tarefa para cliente

#### Cardápio
- `GET /cardapio?ativo=true` - Listar cardápio
- `POST /cardapio` - Criar item
- `PATCH /cardapio/{id}/ativar` - Ativar/desativar item
- `GET /cardapio/whatsapp-text` - Texto formatado para WhatsApp

#### Pedidos
- `GET /pedidos?status=RECEBIDO` - Listar pedidos (Kanban)
- `POST /pedidos` - Criar pedido
- `PATCH /pedidos/{id}/status` - Atualizar status

**Fluxo Kanban:** RECEBIDO → PREPARANDO → PRONTO → ENTREGUE

#### WhatsApp
- `POST /whatsapp/templates/{templateId}/enviar?clienteId=xxx` - Enviar template
- `POST /whatsapp/mensagem?clienteId=xxx` - Enviar mensagem

## 🔐 Autenticação

A API usa **JWT (JSON Web Token)** para autenticação.

1. Faça login em `/auth/login`
2. Use o token retornado no header `Authorization: Bearer {token}`
3. Token válido por 24 horas

### Roles (Papéis)

- **ADMIN** - Acesso total
- **GESTOR** - Gestão de clientes, pedidos e cardápio
- **ATENDENTE** - Visualização e criação de pedidos

## 🧪 Testes

```bash
# Executar todos os testes
mvn test

# Executar apenas testes unitários
mvn test -Dtest=*Test

# Executar apenas testes de integração
mvn test -Dtest=*IntegrationTest
```

Os testes de integração usam **Testcontainers** com PostgreSQL.

## 📊 Métricas e Monitoramento

### Actuator

Endpoints disponíveis:
- `GET /actuator/health` - Status da aplicação
- `GET /actuator/info` - Informações da aplicação
- `GET /actuator/metrics` - Métricas (autenticação necessária)

## 🗄️ Banco de Dados

### Migrations Flyway

As migrations são executadas automaticamente na inicialização.

Localização: `src/main/resources/db/migration/`

### Modelo de Dados

**Principais entidades:**
- `Cliente` - Dados do cliente + métricas (RFM, LTV, recência)
- `CardapioItem` - Itens do cardápio
- `Pedido` + `PedidoItem` - Pedidos e seus itens
- `Interacao` - Histórico de interações com clientes
- `Tarefa` - Tarefas de follow-up e gestão
- `User` - Usuários do sistema

## ⚙️ Funcionalidades Especiais

### 1. Métricas de Cliente (RFM)

Calculadas automaticamente ao marcar pedido como ENTREGUE:
- **Recência** - Dias desde última compra
- **Frequência** - Total de pedidos
- **Monetário** - Ticket médio
- **LTV** - Lifetime Value
- **Cluster** - Classificação (LEAL, NOVO, EM_RISCO, etc.)

### 2. Alertas de Churn

Scheduler que executa diariamente às 8h:
- Identifica clientes em risco de churn
- Cria tarefas automáticas de follow-up
- Prioriza por LTV e histórico

### 3. Cardápio para WhatsApp

Endpoint `/cardapio/whatsapp-text` retorna texto formatado pronto para copiar e colar no WhatsApp.

### 4. Cache

Cache Caffeine configurado para:
- Listagem de cardápio (60s)
- Métricas de cliente (60s)

## 🚀 Deploy

### Build da imagem Docker

```bash
docker build -t anacarla-erp:latest .
```

### Configuração de produção

Certifique-se de:
1. Alterar `JWT_SECRET` para valor seguro (mínimo 256 bits)
2. Usar senha forte para o banco de dados
3. Configurar HTTPS (proxy reverso com Nginx/Traefik)
4. Configurar backup do PostgreSQL
5. Revisar limites de rate limiting se necessário

## 📝 Compatibilidade com Frontend

Este backend mantém **100% de compatibilidade** com o frontend Lovable/JS existente:
- Mesmos endpoints HTTP
- Mesmos formatos JSON
- Mesmos códigos de status

Não são necessárias alterações no frontend para migração.

## 🔄 Comandos Úteis

```bash
# Desenvolvimento
mvn spring-boot:run

# Build
mvn clean package

# Testes
mvn test

# Build Docker
docker build -t anacarla-erp .

# Docker Compose
docker-compose up -d
docker-compose logs -f app
docker-compose down

# Acessar banco PostgreSQL
docker exec -it anacarla-postgres psql -U anacarla -d anacarla
```

## 📄 Licença

Propriedade de Ana Carla.

## 👥 Suporte

Para dúvidas ou problemas, contate a equipe de desenvolvimento.

