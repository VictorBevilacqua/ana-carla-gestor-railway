# 🛠️ Tecnologias do Projeto Ana Carla ERP

Este documento detalha todas as ferramentas, frameworks e tecnologias utilizadas no projeto.

---

## 📋 Índice

1. [Backend](#backend)
2. [Frontend](#frontend)
3. [Banco de Dados](#banco-de-dados)
4. [Ferramentas de Build](#ferramentas-de-build)
5. [Segurança](#segurança)
6. [Testes](#testes)
7. [DevOps e Infraestrutura](#devops-e-infraestrutura)
8. [Documentação de API](#documentação-de-api)

---

## 🔧 Backend

### Linguagem e Framework Principal

- **Java 21**
  - Versão LTS (Long Term Support)
  - Recursos modernos: Records, Pattern Matching, Virtual Threads
  - Sintaxe melhorada e performance otimizada

- **Spring Boot 3.2.0**
  - Framework principal para aplicações Java
  - Configuração por convenção
  - Auto-configuração de componentes
  - Servidor embutido (Tomcat)

### Módulos Spring

- **Spring Data JPA**
  - Abstração para acesso a dados
  - Repositórios automáticos
  - Query Methods e JPQL
  - Suporte a paginação e ordenação

- **Spring Web (MVC)**
  - Controllers REST
  - Validação de entrada
  - Conversão automática JSON
  - Exception Handlers

- **Spring Security**
  - Autenticação e autorização
  - Filtros de segurança
  - Password encoding (BCrypt)
  - Integração com JWT

- **Spring Validation**
  - Validação de DTOs
  - Anotações `@Valid`, `@NotNull`, `@Email`, etc.
  - Mensagens de erro personalizadas

### ORM e Persistência

- **Hibernate 6.4+**
  - Implementação JPA
  - Mapeamento objeto-relacional
  - Cache de segundo nível
  - Lazy/Eager loading

- **Flyway 10.4.1**
  - Versionamento de banco de dados
  - Migrations SQL
  - Controle de versão do schema
  - Histórico de alterações

### Bibliotecas Auxiliares

- **Lombok 1.18.30**
  - Redução de boilerplate
  - `@Data`, `@Builder`, `@Slf4j`
  - Geração automática de getters/setters
  - Construtores automáticos

- **MapStruct 1.5.5**
  - Mapeamento DTO ↔ Entity
  - Geração de código em tempo de compilação
  - Type-safe mapping
  - Performance otimizada

- **JJWT (Java JWT) 0.12.3**
  - Geração de tokens JWT
  - Validação e parsing
  - Assinatura com HS256
  - Claims customizados

### Validação e Utilitários

- **Jakarta Validation API**
  - Validações declarativas
  - Grupos de validação
  - Validadores customizados

- **Jackson**
  - Serialização/Deserialização JSON
  - Configuração de formatos
  - Suporte a Java 8 Time API

---

## 💻 Frontend

### Framework e Linguagem

- **React 18.3+**
  - Biblioteca para interfaces
  - Hooks (useState, useEffect, useContext)
  - Componentes funcionais
  - Virtual DOM

- **TypeScript 5.5+**
  - Superset tipado do JavaScript
  - Type safety
  - Interfaces e tipos
  - Autocompletar e IntelliSense

### Build Tool

- **Vite 5.4+**
  - Build tool moderna
  - Hot Module Replacement (HMR)
  - Build otimizado para produção
  - Suporte nativo a TypeScript

### Estilização

- **Tailwind CSS 3.4+**
  - Utility-first CSS framework
  - Responsividade
  - Dark mode support
  - Customização via config

- **Shadcn/ui**
  - Componentes React reutilizáveis
  - Baseado em Radix UI
  - Acessibilidade (a11y)
  - Customizável com Tailwind

### Roteamento

- **React Router 6.26+**
  - Roteamento declarativo
  - Navegação programática
  - Rotas protegidas (ProtectedRoute)
  - Parâmetros de URL

### HTTP Client

- **Axios 1.7+**
  - Cliente HTTP
  - Interceptors (token JWT)
  - Request/Response transformation
  - Error handling

### Componentes UI

- **Radix UI**
  - Primitivos acessíveis
  - Dialog, Dropdown, Tooltip
  - Sem estilos (headless)
  - WAI-ARIA compliant

- **Recharts 2.12+**
  - Gráficos para React
  - Componentes declarativos
  - Responsivo
  - Customizável

- **Lucide React**
  - Ícones modernos
  - Tree-shakeable
  - SVG otimizado

### Gerenciamento de Estado

- **React Context API**
  - Estado global leve
  - AuthContext para autenticação
  - Sem dependências extras

- **LocalStorage**
  - Persistência de token
  - Dados do usuário logado

---

## 🗄️ Banco de Dados

### Produção

- **PostgreSQL 16+**
  - Banco relacional robusto
  - Suporte a JSON/JSONB
  - Transações ACID
  - Índices avançados
  - Configuração via Docker Compose

### Desenvolvimento

- **H2 Database 2.2+**
  - Banco em memória
  - Modo embedded
  - Console web (http://localhost:8080/h2-console)
  - Compatível com SQL padrão
  - URL: `jdbc:h2:mem:erp`

### Estrutura de Dados

**Entidades Principais:**
- `users` - Usuários do sistema
- `clientes` - Clientes e leads
- `cardapio_items` - Itens do cardápio
- `pedidos` - Pedidos de clientes
- `pedido_items` - Itens dos pedidos
- `tarefas` - Tarefas de follow-up
- `interacoes` - Histórico de interações

**Campos de Auditoria:**
- `created_at` - Data de criação
- `updated_at` - Data de atualização
- Gerenciados automaticamente via JPA Auditing

---

## 🔨 Ferramentas de Build

### Backend

- **Maven 3.9+**
  - Gerenciamento de dependências
  - Build lifecycle
  - Plugins (compiler, spring-boot)
  - Multi-módulos suportado

- **Maven Wrapper (mvnw)**
  - Maven embutido no projeto
  - Sem necessidade de instalação global
  - Versão garantida
  - Cross-platform (Windows/Linux/Mac)

### Frontend

- **npm 10+**
  - Gerenciador de pacotes Node.js
  - Scripts de build
  - Dependências do projeto

- **Node.js 20+ LTS**
  - Runtime JavaScript
  - Backend para frontend tools
  - Module resolution

---

## 🔐 Segurança

### Autenticação

- **JWT (JSON Web Tokens)**
  - Token stateless
  - Expira em 24 horas
  - Assinado com HS256
  - Claims: subject (email), roles

### Autorização

- **Spring Security**
  - Role-based access control (RBAC)
  - Roles: `ADMIN`, `USER`, `VENDEDOR`
  - Endpoints protegidos
  - CORS configurado

### Criptografia

- **BCrypt**
  - Hash de senhas
  - Salt automático
  - Strength: 10 rounds
  - Irreversível

### CORS (Cross-Origin Resource Sharing)

- Configurado para frontend
- Allowed origins: `http://localhost:5173`, `http://localhost:8081`
- Métodos: GET, POST, PUT, DELETE, PATCH
- Headers: Authorization, Content-Type

---

## 🧪 Testes

### Framework de Testes

- **JUnit 5 (Jupiter)**
  - Testes unitários
  - `@Test`, `@BeforeEach`, `@AfterEach`
  - Assertions modernas
  - Parametrized tests

### Testes de Integração

- **Spring Boot Test**
  - `@SpringBootTest`
  - Context loading
  - MockMvc para testes de API
  - TestRestTemplate

- **Testcontainers**
  - Containers Docker para testes
  - PostgreSQL test containers
  - Isolamento de testes
  - Limpeza automática

### Mocking

- **Mockito**
  - Mock de dependências
  - Stub de comportamentos
  - Verificação de chamadas
  - Spy de objetos reais

---

## 🐳 DevOps e Infraestrutura

### Containerização

- **Docker**
  - Containerização da aplicação
  - Dockerfile multi-stage
  - Imagens otimizadas
  - Portabilidade

- **Docker Compose**
  - Orquestração local
  - Serviços: `backend`, `postgres`, `frontend`
  - Networks e volumes
  - Configuração de ambiente

### CI/CD (Preparado para)

- **GitHub Actions** (configurável)
- **Jenkins** (configurável)
- Build automatizado
- Testes automatizados
- Deploy contínuo

### Profiles Spring

- **dev** (padrão)
  - H2 em memória
  - Console H2 ativo
  - Logs detalhados
  - Hot reload

- **prod**
  - PostgreSQL
  - Flyway migrations
  - Logs estruturados
  - Otimizações de performance

---

## 📚 Documentação de API

### Swagger / OpenAPI 3

- **Springdoc OpenAPI 2.3.0**
  - Documentação automática
  - Interface Swagger UI
  - URL: `http://localhost:8080/swagger-ui.html`
  - Testável via browser

### Endpoints Documentados

- `/api/auth/**` - Autenticação
- `/api/clientes/**` - Gestão de clientes
- `/api/cardapio/**` - Cardápio de produtos
- `/api/pedidos/**` - Gestão de pedidos
- `/api/tarefas/**` - Tarefas de follow-up
- `/api/interacoes/**` - Histórico de interações

### Features da Documentação

- Schemas de request/response
- Códigos de status HTTP
- Exemplos de uso
- Autenticação JWT (Bearer token)
- Parâmetros e validações

---

## 📊 Arquitetura

### Padrão de Camadas

```
┌─────────────────────────────────────┐
│         Frontend (React)            │
│  Components, Pages, Hooks, API      │
└─────────────────┬───────────────────┘
                  │ HTTP/REST
┌─────────────────▼───────────────────┐
│    Controllers (@RestController)    │
│         DTOs, Validation            │
├─────────────────────────────────────┤
│      Services (@Service)            │
│      Business Logic, Mappers        │
├─────────────────────────────────────┤
│   Repositories (@Repository)        │
│      Spring Data JPA, Queries       │
├─────────────────────────────────────┤
│         Entities (JPA)              │
│      Domain Models, Relations       │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│   Database (PostgreSQL / H2)        │
└─────────────────────────────────────┘
```

### Design Patterns

- **DTO Pattern** - Separação de camadas
- **Repository Pattern** - Abstração de dados
- **Builder Pattern** - Construção de objetos
- **Dependency Injection** - IoC do Spring
- **Factory Pattern** - JWT Token Factory

---

## 🚀 Execução

### Requisitos

- **Java 21** (JDK)
- **Node.js 20+** (LTS)
- **Docker** (opcional, para produção)
- **PostgreSQL 16+** (para profile prod)

### Comandos

**Backend:**
```bash
cd ana-carla-erp
./mvnw spring-boot:run              # Dev (H2)
./mvnw spring-boot:run -Pprod       # Prod (PostgreSQL)
```

**Frontend:**
```bash
cd ana-carla-gestor-main/ana-carla-gestor-main
npm install
npm run dev
```

**Docker:**
```bash
docker-compose up -d
```

---

## 📝 Notas Importantes

### Credenciais Padrão (Dev)

- **Email:** `admin@anacarla.com.br`
- **Senha:** `admin123`
- **Role:** `ADMIN`

### URLs Importantes

- **Backend:** http://localhost:8080
- **Frontend:** http://localhost:5173 ou http://localhost:8081
- **Swagger:** http://localhost:8080/swagger-ui.html
- **H2 Console:** http://localhost:8080/h2-console

### Estrutura de Pastas

```
ana-carla-erp/
├── src/main/java/br/com/anacarla/erp/
│   ├── config/          # Configurações Spring
│   ├── domain/          # Entidades JPA
│   ├── repository/      # Repositórios
│   ├── service/         # Lógica de negócio
│   ├── web/
│   │   ├── controller/  # REST Controllers
│   │   ├── dto/         # Data Transfer Objects
│   │   └── mapper/      # MapStruct mappers
│   └── security/        # JWT, Filters, Config
└── src/main/resources/
    ├── application.yml  # Configuração principal
    └── db/migration/    # Flyway migrations

ana-carla-gestor-main/ana-carla-gestor-main/
├── src/
│   ├── components/      # Componentes React
│   ├── pages/           # Páginas/Views
│   ├── lib/             # Utilitários
│   │   └── api.ts       # Cliente HTTP (Axios)
│   └── hooks/           # Custom hooks
└── public/              # Assets estáticos
```

---

## 🔄 Roadmap de Melhorias

- [ ] Implementar refresh token
- [ ] Adicionar rate limiting
- [ ] Logs estruturados (ELK Stack)
- [ ] Métricas com Prometheus
- [ ] Cache com Redis
- [ ] Testes E2E com Playwright
- [ ] CI/CD Pipeline
- [ ] Deploy em cloud (AWS/Azure)

---

**Documento gerado em:** 31 de Outubro de 2025  
**Versão do Sistema:** 1.0.0  
**Última atualização:** Migração completa Lovable → Spring Boot

