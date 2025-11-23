# 🚀 Guia de Início Rápido - Ana Carla ERP

## Início Rápido com H2 (Desenvolvimento)

### 1. Pré-requisitos
- Java 21 instalado
- Maven 3.8+ instalado

### 2. Executar a aplicação

```bash
cd ana-carla-erp
mvn spring-boot:run
```

✅ A aplicação estará disponível em `http://localhost:8080`

### 3. Fazer login

**Endpoint:** `POST http://localhost:8080/auth/login`

```json
{
  "email": "admin@anacarla.com.br",
  "senha": "admin123"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "ADMIN",
  "nome": "Administrador",
  "email": "admin@anacarla.com.br"
}
```

### 4. Usar o token

Adicione o header em todas as requisições:
```
Authorization: Bearer {seu_token_aqui}
```

### 5. Testar endpoints

#### Criar um cliente
```bash
curl -X POST http://localhost:8080/clientes \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva",
    "email": "maria@example.com",
    "telefones": "11999999999",
    "consentimentoMarketing": true
  }'
```

#### Criar item do cardápio
```bash
curl -X POST http://localhost:8080/cardapio \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "categoria": "BOVINO",
    "nome": "Patinho Moído Acebolado",
    "preco": 18.00,
    "descricao": "Alecrim e pimenta-do-reino",
    "ativo": true,
    "ordem": 1
  }'
```

#### Listar cardápio ativo
```bash
curl http://localhost:8080/cardapio?ativo=true \
  -H "Authorization: Bearer {token}"
```

#### Obter texto do cardápio para WhatsApp
```bash
curl http://localhost:8080/cardapio/whatsapp-text \
  -H "Authorization: Bearer {token}"
```

#### Criar um pedido
```bash
curl -X POST http://localhost:8080/pedidos \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "clienteId": "{id_do_cliente}",
    "canal": "WHATSAPP",
    "status": "RECEBIDO",
    "itens": [
      {
        "nome": "Patinho Moído Acebolado",
        "precoUnit": 18.00,
        "quantidade": 2
      }
    ]
  }'
```

#### Atualizar status do pedido (Kanban)
```bash
curl -X PATCH http://localhost:8080/pedidos/{id_pedido}/status \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "ENTREGUE"
  }'
```

**Quando um pedido é marcado como ENTREGUE, as métricas do cliente são recalculadas automaticamente!**

#### Ver métricas do cliente
```bash
curl http://localhost:8080/clientes/{id_cliente}/metricas \
  -H "Authorization: Bearer {token}"
```

## 📊 Swagger UI

Acesse a documentação interativa:
```
http://localhost:8080/swagger-ui.html
```

## 🗄️ Console H2 (Desenvolvimento)

Acesse o banco de dados H2:
```
http://localhost:8080/h2-console
```

**Configurações:**
- JDBC URL: `jdbc:h2:mem:erp`
- User: `sa`
- Password: (deixe em branco)

## 🐳 Executar com Docker

### Modo mais rápido (com PostgreSQL):

```bash
cd ana-carla-erp
docker-compose up -d
```

Aguarde alguns segundos e acesse: `http://localhost:8080`

### Ver logs:
```bash
docker-compose logs -f app
```

### Parar:
```bash
docker-compose down
```

## 🧪 Executar Testes

```bash
mvn test
```

Os testes usam Testcontainers e sobem um PostgreSQL real automaticamente.

## 🔄 Fluxo Completo de Teste

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@anacarla.com.br","senha":"admin123"}' \
  | jq -r '.token')

# 2. Criar cliente
CLIENTE_ID=$(curl -s -X POST http://localhost:8080/clientes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","email":"joao@test.com"}' \
  | jq -r '.id')

# 3. Criar item do cardápio
ITEM_ID=$(curl -s -X POST http://localhost:8080/cardapio \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"categoria":"FRANGO","nome":"Frango Grelhado","preco":16.00,"ativo":true}' \
  | jq -r '.id')

# 4. Criar pedido
PEDIDO_ID=$(curl -s -X POST http://localhost:8080/pedidos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"clienteId\":\"$CLIENTE_ID\",\"canal\":\"WHATSAPP\",\"status\":\"RECEBIDO\",\"itens\":[{\"nome\":\"Frango Grelhado\",\"precoUnit\":16.00,\"quantidade\":2}]}" \
  | jq -r '.id')

# 5. Mover pedido pelo Kanban: RECEBIDO -> PREPARANDO -> PRONTO -> ENTREGUE
curl -X PATCH http://localhost:8080/pedidos/$PEDIDO_ID/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"PREPARANDO"}'

curl -X PATCH http://localhost:8080/pedidos/$PEDIDO_ID/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"PRONTO"}'

curl -X PATCH http://localhost:8080/pedidos/$PEDIDO_ID/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"ENTREGUE"}'

# 6. Ver métricas atualizadas do cliente
curl http://localhost:8080/clientes/$CLIENTE_ID/metricas \
  -H "Authorization: Bearer $TOKEN" | jq
```

## 📱 Integração com Frontend Lovable

O backend foi desenhado para manter **100% de compatibilidade** com o frontend atual.

Apenas configure o frontend para apontar para:
```
http://localhost:8080
```

Todos os endpoints, formatos JSON e códigos HTTP são idênticos.

## 🔐 Segurança

- JWT válido por 24 horas
- Roles: ADMIN, GESTOR, ATENDENTE
- CPF/CNPJ mascarado nas respostas (apenas últimos 4 dígitos)

## ⏰ Tarefas Agendadas

O scheduler de alertas de churn executa diariamente às 8h:
- Identifica clientes que não compram há mais tempo que o esperado
- Cria tarefas automáticas de follow-up
- Prioriza por valor (LTV)

**Nota:** Desabilitado em ambiente de teste. Para desabilitar em dev:
```yaml
app:
  scheduling:
    churn-alert-enabled: false
```

## 🎯 Próximos Passos

1. ✅ Backend funcionando
2. 🔄 Conectar frontend Lovable
3. 📱 Integração real com WhatsApp Business API
4. 📊 Dashboard de analytics
5. 📧 Notificações por email
6. 🔔 Alertas em tempo real

## 💡 Dicas

- Use Postman/Insomnia para testar a API facilmente
- Swagger UI é excelente para explorar endpoints
- Em desenvolvimento, o H2 Console ajuda a verificar dados
- Logs detalhados em `DEBUG` mode mostram SQL queries

## 🆘 Problemas Comuns

**Erro: "JWT expired"**
- Faça login novamente para obter novo token

**Erro de permissão**
- Verifique se seu usuário tem a role adequada

**Flyway migration error**
- Delete o banco H2 (restart da aplicação resolve)
- Para PostgreSQL: `docker-compose down -v` e suba novamente

**Testes falhando**
- Certifique-se que o Docker está rodando (Testcontainers precisa)

---

✨ **Projeto pronto para uso!**

