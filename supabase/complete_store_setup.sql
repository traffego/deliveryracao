-- =====================================================
-- DADOS DE EXEMPLO - Completar Setup da Loja
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- 1. Inserir Categorias
INSERT INTO categories (name, slug, description, is_active, sort_order)
VALUES
  ('Ração para Cães', 'racao-caes', 'Ração de qualidade para cachorros de todos os tamanhos', true, 1),
  ('Ração para Gatos', 'racao-gatos', 'Alimentação balanceada para felinos', true, 2),
  ('Petiscos', 'petiscos', 'Petiscos e snacks para seu pet', true, 3)
RETURNING id, name;

-- 2. Configurar Delivery (Taxa fixa de R$10)
INSERT INTO delivery_settings (
  store_id,
  delivery_mode,
  fixed_general_fee,
  estimated_delivery_time_min,
  estimated_delivery_time_max
)
VALUES (
  'b9b9b99a-da04-471e-9e18-9af8ad79f2a1',
  'fixed_general',
  10.00,
  30,
  60
);

-- 3. Configurar Pagamentos
INSERT INTO payment_settings (
  store_id,
  cash_on_delivery_enabled,
  card_on_delivery_enabled
)
VALUES (
  'b9b9b99a-da04-471e-9e18-9af8ad79f2a1',
  true,
  true
);

-- 4. Inserir Produtos de Exemplo
-- Primeiro, vamos pegar o ID da categoria "Ração para Cães"
-- Execute e COPIE o ID retornado:
SELECT id FROM categories WHERE slug = 'racao-caes';

-- Depois, SUBSTITUA 'CATEGORY_ID_CAES' abaixo pelo ID retornado e execute:

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
    'b9b9b99a-da04-471e-9e18-9af8ad79f2a1',
    'CATEGORY_ID_CAES',
    'Ração Premium para Cães Adultos',
    'racao-premium-caes-adultos',
    'Ração super premium com alto teor de proteínas, ideal para cães adultos de todas as raças. Ingredientes selecionados para uma nutrição completa.',
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
    'b9b9b99a-da04-471e-9e18-9af8ad79f2a1',
    'CATEGORY_ID_CAES',
    'Ração Filhotes Premium',
    'racao-filhotes-premium',
    'Nutrição completa para filhotes em crescimento. Rica em DHA para desenvolvimento cerebral e cálcio para ossos fortes.',
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
    'b9b9b99a-da04-471e-9e18-9af8ad79f2a1',
    'CATEGORY_ID_CAES',
    'Ração Sênior 7+',
    'racao-senior-7',
    'Fórmula especial para cães idosos acima de 7 anos. Com condroitina e glicosamina para articulações saudáveis.',
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
  ),
  (
    'b9b9b99a-da04-471e-9e18-9af8ad79f2a1',
    'CATEGORY_ID_CAES',
    'Ração Light para Cães',
    'racao-light-caes',
    'Ração com baixo teor de gordura, ideal para cães com tendência ao sobrepeso ou pouca atividade física.',
    'bulk',
    13.00,
    'kg',
    'both',
    10.00,
    0.5,
    70.00,
    'Fit & Health',
    'FH-001',
    true,
    true
  ),
  (
    'b9b9b99a-da04-471e-9e18-9af8ad79f2a1',
    'CATEGORY_ID_CAES',
    'Ração Raças Pequenas',
    'racao-racas-pequenas',
    'Grãos menores especialmente desenvolvidos para cães de raças pequenas e mini. Fácil digestão.',
    'bulk',
    16.00,
    'kg',
    'both',
    10.00,
    0.5,
    50.00,
    'Small Breed',
    'SB-001',
    true,
    true
  ),
  (
    'b9b9b99a-da04-471e-9e18-9af8ad79f2a1',
    'CATEGORY_ID_CAES',
    'Ração Extra Grande 15kg',
    'racao-extra-grande-15kg',
    'Saco fechado de 15kg de ração premium para cães adultos. Economia para quem tem mais de um pet!',
    'packaged',
    165.00,
    'un',
    'quantity',
    null,
    1,
    30.00,
    'Premium Pet',
    'PP-15KG',
    true,
    false
  );

-- ✅ PRONTO! Execute os comandos acima em ordem.
