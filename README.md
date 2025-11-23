# 🥗 Pitada Saudável - Sistema de Gestão ERP

Sistema de gestão completo para empresa de marmitas saudáveis, desenvolvido com **Java Spring Boot** (backend) e **React + TypeScript** (frontend).

## 👥 Equipe do Projeto

- **Cliente**: Ana Carla - Pitada Saudável
- **Curso**: Ciência de Dados
- **Disciplina**: Projeto II
- **Tecnologia Principal**: Java 21 + Spring Boot

---

## 🎯 Descrição do Projeto

Sistema ERP desenvolvido para gerenciar:
- ✅ **Pedidos** (Kanban board com drag-and-drop)
- ✅ **Clientes** (CRM com métricas RFM, LTV, ticket médio)
- ✅ **Cardápio** (Gerenciamento de itens e categorias)
- ✅ **Dashboard** (Métricas em tempo real)

---

## 🏗️ Arquitetura

### **Backend (Java)**
```
ana-carla-erp/
├── src/main/java/br/com/anacarla/erp/
│   ├── domain/          # Entidades JPA (POO)
│   ├── repository/      # Acesso ao banco de dados
│   ├── service/         # Lógica de negócio
│   ├── web/controller/  # APIs REST
│   └── config/          # Configurações
└── src/main/resources/
    ├── application.yml  # Configuração
    └── db/migration/    # Migrations Flyway
```

### **Frontend (React)**
```
ana-carla-gestor-main/
└── src/
    ├── components/      # Componentes reutilizáveis
    ├── pages/           # Páginas da aplicação
    └── lib/             # API client
```

---

## 💻 Tecnologias Utilizadas

### **Backend**
- ☕ Java 21
- 🍃 Spring Boot 3.2.0
- 🗄️ PostgreSQL 15
- 🔐 Spring Security + JWT
- 📚 JPA/Hibernate (ORM)
- 🔄 Flyway (Migrations)
- 📦 Maven

### **Frontend**
- ⚛️ React 18 + TypeScript
- 🎨 Tailwind CSS + shadcn/ui
- 🚀 Vite
- 📊 Recharts (gráficos)
- 🎭 @hello-pangea/dnd (drag-and-drop)

### **Infraestrutura**
- 🐳 Docker (PostgreSQL)
- 🔧 Docker Compose

---

## 📋 Pré-requisitos

1. **Java 21** (JDK)
   - [Download Oracle JDK 21](https://www.oracle.com/java/technologies/downloads/#java21)

2. **Node.js** (v18 ou superior)
   - [Download Node.js](https://nodejs.org/)

3. **Docker Desktop**
   - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

4. **Git**
   - [Download Git](https://git-scm.com/)

---

## 🚀 Como Executar o Projeto

### **Passo 1: Clonar o Repositório**

```bash
git clone https://github.com/mkio14/ana-carla-gestor.git
cd ana-carla-gestor
```

### **Passo 2: Iniciar o Banco de Dados (PostgreSQL)**

1. **Abra o Docker Desktop** (aguarde inicializar completamente)

2. **Execute no PowerShell** (como Administrador):

```powershell
# Criar e iniciar o container PostgreSQL
docker run -d `
  --name anacarla-postgres `
  -e POSTGRES_USER=anacarla `
  -e POSTGRES_PASSWORD=secret `
  -e POSTGRES_DB=anacarla `
  -p 5432:5432 `
  postgres:15-alpine
```

3. **Verificar se está rodando**:
```powershell
docker ps
```

### **Passo 3: Iniciar o Backend (Java)**

1. **Navegue até o diretório do backend**:
```powershell
cd ana-carla-erp
```

2. **Configure o Java 21** (ajuste o caminho se necessário):
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
```

3. **Inicie o backend**:
```powershell
.\mvnw.cmd clean spring-boot:run -Dspring-boot.run.profiles=prod
```

✅ **Backend rodando em**: `http://localhost:8080`

### **Passo 4: Iniciar o Frontend (React)**

1. **Abra um NOVO terminal PowerShell**

2. **Navegue até o diretório do frontend**:
```powershell
cd ana-carla-gestor-main\ana-carla-gestor-main
```

3. **Instale as dependências** (primeira vez):
```powershell
npm install
```

4. **Inicie o frontend**:
```powershell
npm run dev
```

✅ **Frontend rodando em**: `http://localhost:8081`

### **Passo 5: Acessar o Sistema**

Abra o navegador e acesse: **http://localhost:8081**

---

## 📚 Conceitos de POO Implementados

### **1. Encapsulamento**
```java
@Entity
public class Cliente extends BaseEntity {
    @Column(nullable = false)
    private String nome;  // Atributo privado
    
    private String telefones;
    
    // Getters e Setters via Lombok
}
```

### **2. Herança**
```java
// Classe base abstrata
public abstract class BaseEntity {
    private UUID id;
    private Instant createdAt;
    private Instant updatedAt;
}

// Subclasses herdam
public class Cliente extends BaseEntity { /* ... */ }
public class Pedido extends BaseEntity { /* ... */ }
```

### **3. Polimorfismo**
```java
public class User extends BaseEntity implements UserDetails {
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
    // Outros métodos @Override...
}
```

### **4. Abstração**
```java
// Interface Repository (abstração de acesso a dados)
public interface ClienteRepository extends JpaRepository<Cliente, UUID> {
    List<Cliente> findByNomeContainingIgnoreCase(String nome);
}
```

---

## 🗄️ Banco de Dados

### **Relacionamentos JPA**

```java
// One-to-Many
@Entity
public class Pedido {
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    private List<PedidoItem> itens;
}

// Many-to-One
@Entity
public class PedidoItem {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;
}
```

### **Migrations Flyway**
- `V1__init.sql` - Criação das tabelas
- `V2__insert_admin_user.sql` - Usuário admin
- `V3__update_categoria_enum.sql` - Atualização de categorias
- `V4__add_observacoes_to_clientes.sql` - Campo observações

---

## 📊 Funcionalidades Principais

### **Dashboard**
- Receita do dia e últimos 30 dias
- Ticket médio (últimos 30 dias)
- Pedidos de hoje
- Clientes ativos
- Gráfico de receita dos últimos 7 dias

### **Pedidos**
- Kanban board com 5 colunas (Recebido, Preparando, Pronto, Entregue, Cancelado)
- Drag-and-drop para alterar status
- Criar, editar e visualizar pedidos
- Filtro por status
- Finalizar pedidos (move para histórico)

### **Clientes**
- Lista com busca
- Métricas por cliente:
  - Total de pedidos
  - Gasto (últimos 30 dias)
  - Último pedido
  - Ticket médio
- Criar e editar clientes
- Histórico de pedidos

### **Cardápio**
- Gerenciar itens do cardápio
- Categorias: Proteína, Salada, Acompanhamento, Bebida, Bowl, Sobremesa
- Ativar/desativar itens
- Preço e estoque

---

## 🔧 Configuração Avançada

### **Variáveis de Ambiente (Backend)**

Arquivo: `ana-carla-erp/src/main/resources/application-prod.yml`

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/anacarla
    username: anacarla
    password: secret
```

### **Proxy Frontend → Backend**

Arquivo: `ana-carla-gestor-main/vite.config.ts`

```typescript
server: {
  port: 8081,
  proxy: {
    '/cardapio': { target: 'http://localhost:8080' },
    '/clientes': { target: 'http://localhost:8080' },
    '/pedidos': { target: 'http://localhost:8080' },
  }
}
```

---

## 🧪 Testes

### **Backend (Java)**
```powershell
cd ana-carla-erp
.\mvnw.cmd test
```

---

## 📦 Build para Produção

### **Backend**
```powershell
cd ana-carla-erp
.\mvnw.cmd clean package -DskipTests
# Arquivo gerado: target/ana-carla-erp-1.0.0.jar
```

### **Frontend**
```powershell
cd ana-carla-gestor-main\ana-carla-gestor-main
npm run build
# Arquivos gerados: dist/
```

---

## 🐛 Troubleshooting

### **Erro: "Connection refused" no backend**
- ✅ Verifique se o Docker Desktop está rodando
- ✅ Execute `docker ps` para ver se o container PostgreSQL está ativo

### **Erro: "JAVA_HOME not found"**
- ✅ Configure a variável de ambiente JAVA_HOME
- ✅ Verifique: `java -version` (deve mostrar Java 21)

### **Erro: Frontend não conecta no backend**
- ✅ Verifique se o backend está rodando na porta 8080
- ✅ Acesse: http://localhost:8080/cardapio (deve retornar JSON)

### **Erro: "Build failure" no Maven**
- ✅ Limpe o cache: `.\mvnw.cmd clean`
- ✅ Delete a pasta `target` e tente novamente

---

## 📖 Documentação Adicional

### **API REST (Swagger)**
Acesse com o backend rodando: http://localhost:8080/swagger-ui.html

### **Endpoints Principais**
- `GET /cardapio` - Lista itens do cardápio
- `GET /clientes` - Lista clientes
- `GET /pedidos` - Lista pedidos
- `POST /pedidos` - Cria novo pedido
- `PATCH /pedidos/{id}/status` - Atualiza status do pedido

---

## 🎓 Sobre o Projeto Acadêmico

Este projeto foi desenvolvido como trabalho da disciplina de **Programação Orientada a Objetos**, demonstrando:

✅ **Encapsulamento** - Atributos privados com getters/setters
✅ **Herança** - Classe BaseEntity com 7 subclasses
✅ **Polimorfismo** - Implementação de interfaces (UserDetails)
✅ **Abstração** - Arquitetura em camadas (Controller → Service → Repository)
✅ **Persistência em Banco de Dados** - JPA/Hibernate + PostgreSQL
✅ **Relacionamentos** - @OneToMany, @ManyToOne
✅ **Padrões de Projeto** - Repository, DTO, Service Layer, Builder

---

## 📝 Licença

Este projeto foi desenvolvido para fins acadêmicos.

---

## 👨‍💻 Contato

Para dúvidas sobre o projeto, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ☕ Java e ❤️ para a Pitada Saudável**

