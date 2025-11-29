-- =====================================================
-- DADOS DE EXEMPLO - Loja de Teste
-- Execute este script para criar uma loja de exemplo
-- =====================================================

-- Inserir loja de exemplo
INSERT INTO stores (slug, name, description, phone, email, whatsapp, street, number, neighborhood, city, state, zip_code, is_active, is_main_admin)
VALUES (
  'pet-racao-centro',
  'Pet Ração Centro',
  'Sua loja de ração de confiança no centro da cidade',
  '(11) 98765-4321',
  'contato@petracao.com',
  '(11) 98765-4321',
  'Rua das Flores',
  '123',
  'Centro',
  'São Paulo',
  'SP',
  '01000-000',
  true,
  true
)
RETURNING id;

-- Guardar o ID da loja (você vai precisar copiar o UUID retornado)
-- Para os próximos comandos, substitua 'STORE_ID_AQUI' pelo UUID retornado acima

-- Inserir categorias
INSERT INTO categories (name, slug, description, is_active, sort_order)
VALUES
  ('Ração para Cães', 'racao-caes', 'Ração de qualidade para cachorros de todos os tamanhos', true, 1),
  ('Ração para Gatos', 'racao-gatos', 'Alimentação balanceada para felinos', true, 2),
  ('Petiscos', 'petiscos', 'Petiscos e snacks para seu pet', true, 3);

-- Depois de inserir a loja, copie o ID e execute este comando substituind o STORE_ID_AQUI:

-- Configurar delivery
INSERT INTO delivery_settings (
  store_id,
  delivery_mode,
  fixed_general_fee,
  estimated_delivery_time_min,
  estimated_delivery_time_max
)
VALUES (
  'STORE_ID_AQUI', -- SUBSTITUA pelo ID da loja
  'fixed_general',
  10.00,
  30,
  60
);

-- Configurar pagamentos
INSERT INTO payment_settings (
  store_id,
  cash_on_delivery_enabled,
  card_on_delivery_enabled
)
VALUES (
  'STORE_ID_AQUI', -- SUBSTITUA pelo ID da loja
  true,
  true
);

-- Inserir produtos de exemplo
-- Primeiro pegue o ID da categoria de "Ração para Cães"
-- Depois execute estes INSERTs substituindo STORE_ID_AQUI e CATEGORY_ID_AQUI

INSERT INTO products (
  store_id,
  category_id,
  name,
  slug,
  description,
  product_type,
  price,
  unit,
  order_mode,
  min_order_value,
  min_order_quantity,
  stock_quantity,
  brand,
  sku,
  is_active,
  is_featured
)
VALUES
  (
    'STORE_ID_AQUI',
    'CATEGORY_ID_AQUI',
    'Ração Premium para Cães Adultos',
    'racao-premium-caes-adultos',
    'Ração super premium com alto teor de proteínas, ideal para cães adultos de todas as raças',
    'bulk',
    12.50,
    'kg',
    'both',
    10.00,
    0.5,
    100.00,
    'Premium Pet',
    'PP-001',
    true,
    true
  ),
  (
    'STORE_ID_AQUI',
    'CATEGORY_ID_AQUI',
    'Ração Filhotes',
    'racao-filhotes',
    'Nutrição completa para filhotes em crescimento',
    'bulk',
    15.00,
    'kg',
    'both',
    10.00,
    0.5,
    80.00,
    'Puppy Care',
    'PC-001',
    true,
    true
  ),
  (
    'STORE_ID_AQUI',
    'CATEGORY_ID_AQUI',
    'Ração Sênior',
    'racao-senior',
    'Fórmula especial para cães idosos',
    'bulk',
    14.00,
    'kg',
    'both',
    10.00,
    0.5,
    60.00,
    'Senior Life',
    'SL-001',
    true,
    true
  );

-- ✅ PRONTO! Agora você tem uma loja de exemplo com produtos
