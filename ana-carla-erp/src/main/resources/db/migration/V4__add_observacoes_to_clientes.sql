-- V4__add_observacoes_to_clientes.sql
-- Adicionar campo observacoes na tabela clientes

ALTER TABLE clientes ADD COLUMN IF NOT EXISTS observacoes TEXT;

