# 📋 Requisitos do Sistema - Ana Carla ERP

## Pré-requisitos para Execução

### ✅ Obrigatórios

#### 1. Java Development Kit (JDK)
- **Versão:** Java 21 ou superior
- **Verificar:** `java -version`
- **Status atual:** ✅ Java 24 instalado
- **Download:** https://www.oracle.com/java/technologies/downloads/

#### 2. Maven (Opcional com Maven Wrapper)
- **Versão:** Maven 3.8+ 
- **Verificar:** `mvn --version`
- **Nota:** Projeto inclui Maven Wrapper (`mvnw.cmd`), então Maven não é obrigatório
- **Download:** https://maven.apache.org/download.cgi

### 🔧 Opcionais (mas recomendados)

#### 3. IDE Java
Uma das seguintes:
- **IntelliJ IDEA** (Community ou Ultimate)
- **Eclipse IDE for Java**
- **VS Code** com extensão "Extension Pack for Java"

#### 4. Docker Desktop (para produção)
- Para executar com PostgreSQL via `docker-compose`
- **Download:** https://www.docker.com/products/docker-desktop/

#### 5. Cliente REST
Para testar a API:
- **Postman** - https://www.postman.com/downloads/
- **Insomnia** - https://insomnia.rest/download
- **VS Code REST Client** - Extensão gratuita

---

## Dependências do Projeto (Maven)

As dependências estão definidas no `pom.xml`:

### Spring Boot 3.2.0
```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.0</version>
</parent>
```

### Principais Dependências

#### Framework Core
- ✅ `spring-boot-starter-web` - API REST
- ✅ `spring-boot-starter-data-jpa` - Persistência JPA/Hibernate
- ✅ `spring-boot-starter-validation` - Bean Validation
- ✅ `spring-boot-starter-security` - Segurança
- ✅ `spring-boot-starter-cache` - Cache
- ✅ `spring-boot-starter-actuator` - Monitoramento

#### Banco de Dados
- ✅ `postgresql` - Driver PostgreSQL (produção)
- ✅ `h2` - Banco H2 em memória (desenvolvimento)
- ✅ `flyway-core` - Migrations de banco de dados
- ✅ `flyway-database-postgresql` - Suporte Flyway para PostgreSQL

#### Segurança
- ✅ `jjwt-api` (0.12.3) - JSON Web Tokens
- ✅ `jjwt-impl` - Implementação JWT
- ✅ `jjwt-jackson` - Integração JWT com Jackson

#### Cache
- ✅ `caffeine` - Cache em memória de alta performance

#### Mapeamento
- ✅ `mapstruct` (1.5.5) - Mapeamento Entity ↔ DTO
- ✅ `mapstruct-processor` - Processador de anotações

#### JSON
- ✅ `jackson-databind` - Serialização JSON
- ✅ `jackson-datatype-jsr310` - Suporte para Java 8 Date/Time
- ✅ `hypersistence-utils-hibernate-63` - Suporte JSONB

#### Documentação
- ✅ `springdoc-openapi-starter-webmvc-ui` (2.3.0) - Swagger/OpenAPI

#### Utilitários
- ✅ `lombok` - Redução de boilerplate code

#### Testes
- ✅ `spring-boot-starter-test` - Testes Spring Boot
- ✅ `spring-security-test` - Testes de segurança
- ✅ `testcontainers` (1.19.3) - Containers para testes
- ✅ `testcontainers-postgresql` - PostgreSQL para testes
- ✅ `testcontainers-junit-jupiter` - Integração JUnit 5

---

## Requisitos de Hardware

### Mínimo
- **RAM:** 4 GB (2 GB para a aplicação)
- **Disco:** 500 MB (para dependências Maven + build)
- **CPU:** Dual-core 2.0 GHz

### Recomendado
- **RAM:** 8 GB ou mais
- **Disco:** 1 GB livre
- **CPU:** Quad-core 2.5 GHz ou superior

---

## Requisitos de Rede

### Desenvolvimento (H2)
- ✅ Nenhum requisito de rede
- Banco de dados em memória

### Produção (PostgreSQL)
- PostgreSQL Server (versão 12+)
- Porta padrão: 5432
- Ou usar Docker Compose incluído no projeto

---

## Portas Utilizadas

| Porta | Serviço | Descrição |
|-------|---------|-----------|
| 8080 | Spring Boot | API REST principal |
| 5432 | PostgreSQL | Banco de dados (prod) |

**Nota:** Certifique-se de que a porta 8080 está livre antes de iniciar.

---

## Variáveis de Ambiente

### Desenvolvimento (H2) - Nenhuma necessária
Usa valores padrão do `application.yml`

### Produção (PostgreSQL) - Obrigatórias

```bash
# Spring Profile
SPRING_PROFILES_ACTIVE=prod

# Database
DB_HOST=localhost          # Host do PostgreSQL
DB_PORT=5432              # Porta do PostgreSQL
DB_NAME=anacarla          # Nome do banco
DB_USER=anacarla          # Usuário do banco
DB_PASSWORD=sua_senha     # Senha do banco

# Security
JWT_SECRET=sua_chave_secreta_minimo_256_bits
```

### Configuração no Windows PowerShell:

```powershell
$env:SPRING_PROFILES_ACTIVE="prod"
$env:DB_HOST="localhost"
$env:DB_PORT="5432"
$env:DB_NAME="anacarla"
$env:DB_USER="anacarla"
$env:DB_PASSWORD="sua_senha"
$env:JWT_SECRET="sua_chave_secreta_aqui"
```

---

## Compatibilidade de Sistemas Operacionais

### ✅ Windows
- Windows 10 ou superior
- PowerShell 5.1 ou superior
- **Status:** Totalmente suportado

### ✅ macOS
- macOS 10.15 (Catalina) ou superior
- Terminal padrão ou iTerm2
- **Status:** Totalmente suportado

### ✅ Linux
- Ubuntu 20.04+, Debian 10+, CentOS 8+, Fedora 33+
- Bash shell
- **Status:** Totalmente suportado

---

## Navegadores Suportados (para Swagger UI)

- ✅ Google Chrome 90+
- ✅ Mozilla Firefox 88+
- ✅ Microsoft Edge 90+
- ✅ Safari 14+

---

## Verificar Requisitos

Execute estes comandos para verificar se tudo está instalado:

### Java
```bash
java -version
```
**Esperado:** `java version "21"` ou superior

### Maven (opcional)
```bash
mvn --version
```
**Esperado:** `Apache Maven 3.8.x` ou superior

### Docker (opcional)
```bash
docker --version
docker-compose --version
```

### Porta 8080 livre (Windows)
```powershell
Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
```
**Esperado:** Nenhum resultado (porta livre)

---

## Instalação das Dependências

### Automática (primeira execução)
Ao executar `mvnw.cmd clean spring-boot:run`, o Maven:

1. ✅ Baixa Maven (se necessário)
2. ✅ Baixa todas as dependências (~200 MB)
3. ✅ Compila o projeto
4. ✅ Inicia a aplicação

**Tempo estimado:** 3-5 minutos (primeira vez)

### Manual (pré-download)
```bash
cd ana-carla-erp
mvnw.cmd dependency:resolve
```

---

## Resolução de Problemas Comuns

### "JAVA_HOME is not set"

**Solução (Windows):**
```powershell
$javaPath = (Get-Command java).Source
$javaHome = (Get-Item $javaPath).Directory.Parent.Parent.FullName
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', $javaHome, 'Machine')
```

### "Port 8080 already in use"

**Solução:** Mude a porta em `application.yml`:
```yaml
server:
  port: 8081
```

### Downloads lentos do Maven

**Solução:** Configure um mirror Maven mais próximo em `~/.m2/settings.xml`

---

## Documentos Relacionados

- 📖 `README.md` - Documentação geral
- 🚀 `START_APP.md` - Guia de execução
- 📋 `MIGRATION_GUIDE.md` - Guia de migração
- 🏗️ `PROJECT_STRUCTURE.md` - Estrutura do projeto
- 📝 `API_EXAMPLES.http` - Exemplos de API

---

## Resumo Rápido

| Componente | Status | Ação Necessária |
|------------|--------|-----------------|
| Java 21+ | ✅ Instalado (Java 24) | Nenhuma |
| Maven | ⚠️ Opcional | Usar Maven Wrapper |
| IDE | ℹ️ Opcional | Recomendado |
| Docker | ⚠️ Opcional | Apenas para produção |
| Porta 8080 | ✅ Livre | Nenhuma |

**Status:** ✅ **Sistema pronto para executar!**

Execute: `.\mvnw.cmd clean spring-boot:run`

