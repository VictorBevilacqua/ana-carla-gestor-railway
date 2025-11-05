-- Criar usuário admin se não existir
MERGE INTO users KEY(email) VALUES (
    RANDOM_UUID(),
    'admin@anacarla.com.br',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Administrador',
    'ADMIN',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

