-- Ana Carla ERP - Initial Schema

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(200) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nome VARCHAR(200) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'GESTOR', 'ATENDENTE')),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_user_email ON users(email);

-- Clientes table
CREATE TABLE clientes (
    id UUID PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    telefones VARCHAR(500),
    email VARCHAR(200),
    data_nascimento DATE,
    cpf_cnpj VARCHAR(20),
    consentimento_marketing BOOLEAN DEFAULT FALSE,
    canal_aquisicao VARCHAR(50),
    preferencias_contato JSONB,
    nutricional JSONB,
    enderecos JSONB,
    -- Métricas materializadas
    total_pedidos INTEGER DEFAULT 0,
    ticket_medio NUMERIC(12,2) DEFAULT 0,
    valor_total NUMERIC(12,2) DEFAULT 0,
    ultima_compra TIMESTAMP,
    recencia_dias INTEGER,
    intervalo_medio_recompra INTEGER,
    ltv NUMERIC(12,2) DEFAULT 0,
    rfm JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_cliente_email ON clientes(email);
CREATE INDEX idx_cliente_cpf_cnpj ON clientes(cpf_cnpj);
CREATE INDEX idx_cliente_recencia ON clientes(recencia_dias);
CREATE INDEX idx_cliente_preferencias_canal ON clientes((preferencias_contato->>'canal')); -- PostgreSQL JSONB indexing

-- Cardápio
CREATE TABLE cardapio_item (
    id UUID PRIMARY KEY,
    categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('BOVINO', 'FRANGO', 'PORCO', 'PEIXE', 'VEGETARIANO', 'ACOMPANHAMENTO', 'SALADA', 'SOBREMESA', 'BEBIDA')),
    nome VARCHAR(200) NOT NULL,
    preco NUMERIC(12,2) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    ordem INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_cardapio_ativo ON cardapio_item(ativo);
CREATE INDEX idx_cardapio_categoria ON cardapio_item(categoria);
CREATE INDEX idx_cardapio_ordem ON cardapio_item(ordem);

-- Pedidos
CREATE TABLE pedidos (
    id UUID PRIMARY KEY,
    cliente_id UUID NOT NULL,
    valor_total NUMERIC(12,2) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('RECEBIDO', 'PREPARANDO', 'PRONTO', 'ENTREGUE', 'CANCELADO')),
    canal VARCHAR(50) NOT NULL CHECK (canal IN ('WHATSAPP', 'WEB', 'TELEFONE', 'PRESENCIAL')),
    data_criacao TIMESTAMP NOT NULL,
    data_entrega TIMESTAMP,
    observacoes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE INDEX idx_pedido_status ON pedidos(status);
CREATE INDEX idx_pedido_cliente ON pedidos(cliente_id);
CREATE INDEX idx_pedido_data_criacao ON pedidos(data_criacao);
CREATE INDEX idx_pedido_status_data ON pedidos(status, data_criacao);

-- Itens do pedido
CREATE TABLE pedido_item (
    id UUID PRIMARY KEY,
    pedido_id UUID NOT NULL,
    item_id UUID,
    nome VARCHAR(200) NOT NULL,
    preco_unit NUMERIC(12,2) NOT NULL,
    quantidade INTEGER NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
);

CREATE INDEX idx_pedido_item_pedido ON pedido_item(pedido_id);

-- Interações
CREATE TABLE interacoes (
    id UUID PRIMARY KEY,
    cliente_id UUID NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('WHATSAPP', 'LIGACAO', 'EMAIL', 'SMS', 'NOTA')),
    resumo TEXT,
    anexo_url VARCHAR(500),
    autor VARCHAR(100),
    data_hora TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE INDEX idx_interacao_cliente ON interacoes(cliente_id);
CREATE INDEX idx_interacao_data ON interacoes(data_hora);
CREATE INDEX idx_interacao_tipo ON interacoes(tipo);

-- Tarefas
CREATE TABLE tarefas (
    id UUID PRIMARY KEY,
    cliente_id UUID,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    responsavel VARCHAR(100),
    prioridade VARCHAR(50) NOT NULL CHECK (prioridade IN ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE')),
    due_date TIMESTAMP,
    status VARCHAR(50) NOT NULL CHECK (status IN ('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA')),
    origem VARCHAR(50) NOT NULL CHECK (origem IN ('ALERTA_CHURN', 'MANUAL', 'ANIVERSARIO', 'FEEDBACK')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE INDEX idx_tarefa_cliente ON tarefas(cliente_id);
CREATE INDEX idx_tarefa_status ON tarefas(status);
CREATE INDEX idx_tarefa_responsavel ON tarefas(responsavel);
CREATE INDEX idx_tarefa_due_date ON tarefas(due_date);

-- Dados iniciais (usuário admin padrão)
-- Senha: admin123 (deve ser alterada em produção)
INSERT INTO users (id, email, senha, nome, role, ativo, created_at)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'admin@anacarla.com.br',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- bcrypt de "admin123"
    'Administrador',
    'ADMIN',
    TRUE,
    CURRENT_TIMESTAMP
);

