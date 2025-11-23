-- V5__add_endereco_to_clientes.sql
-- Adicionar campo endereco na tabela clientes

ALTER TABLE clientes ADD COLUMN IF NOT EXISTS endereco VARCHAR(500);

