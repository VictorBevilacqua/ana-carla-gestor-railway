ALTER TABLE clientes
ADD COLUMN ativo BOOLEAN NOT NULL DEFAULT TRUE;

CREATE INDEX idx_cliente_ativo ON clientes(ativo);
