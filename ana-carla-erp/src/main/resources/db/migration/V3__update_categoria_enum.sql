-- Atualizar constraint de categoria para novos valores
ALTER TABLE cardapio_item DROP CONSTRAINT IF EXISTS cardapio_item_categoria_check;
ALTER TABLE cardapio_item ADD CONSTRAINT cardapio_item_categoria_check 
    CHECK (categoria IN ('PROTEINA', 'SALADA', 'ACOMPANHAMENTO', 'BEBIDA', 'BOWL', 'SOBREMESA'));

