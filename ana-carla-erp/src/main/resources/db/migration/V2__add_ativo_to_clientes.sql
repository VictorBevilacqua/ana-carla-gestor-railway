-- Criar usuário admin se não existir (PostgreSQL)
INSERT INTO users (id, email, senha, nome, role, ativo, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'admin@anacarla.com.br',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Administrador',
    'ADMIN',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;
