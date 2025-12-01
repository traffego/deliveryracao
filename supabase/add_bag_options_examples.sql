-- =====================================================
-- Script de Exemplo: Adicionar Opções de Sacos
-- Execute DEPOIS de aplicar a migration 005
-- =====================================================

-- Atualizar produtos existentes com opções de sacos
-- Exemplo: Ração Premium para Cães Adultos

UPDATE products 
SET bag_options = '[
    {"size": "1kg", "weight": 1, "price": 15.00, "stock": 20, "sku": "PP-1KG"},
    {"size": "3kg", "weight": 3, "price": 42.00, "stock": 15, "sku": "PP-3KG"},
    {"size": "15kg", "weight": 15, "price": 165.00, "stock": 10, "sku": "PP-15KG"}
]'::jsonb
WHERE slug = 'racao-premium-caes-adultos';

-- Ração Filhotes Premium
UPDATE products
SET bag_options = '[
    {"size": "1kg", "weight": 1, "price": 18.00, "stock": 15, "sku": "PF-1KG"},
    {"size": "3kg", "weight": 3, "price": 51.00, "stock": 10, "sku": "PF-3KG"},
    {"size": "10kg", "weight": 10, "price": 155.00, "stock": 8, "sku": "PF-10KG"}
]'::jsonb
WHERE slug = 'racao-filhotes-premium';

-- Ração Sênior 7+
UPDATE products
SET bag_options = '[
    {"size": "1kg", "weight": 1, "price": 17.00, "stock": 12, "sku": "RS-1KG"},
    {"size": "3kg", "weight": 3, "price": 48.00, "stock": 8, "sku": "RS-3KG"},
    {"size": "15kg", "weight": 15, "price": 175.00, "stock": 5, "sku": "RS-15KG"}
]'::jsonb
WHERE slug = 'racao-senior-7';

-- Ração Light para Cães
UPDATE products
SET bag_options = '[
    {"size": "1kg", "weight": 1, "price": 16.00, "stock": 18, "sku": "RL-1KG"},
    {"size": "3kg", "weight": 3, "price": 45.00, "stock": 12, "sku": "RL-3KG"},
    {"size": "12kg", "weight": 12, "price": 152.00, "stock": 7, "sku": "RL-12KG"}
]'::jsonb
WHERE slug = 'racao-light-caes';

-- Ração Raças Pequenas
UPDATE products
SET bag_options = '[
    {"size": "1kg", "weight": 1, "price": 19.00, "stock": 25, "sku": "RP-1KG"},
    {"size": "3kg", "weight": 3, "price": 54.00, "stock": 15, "sku": "RP-3KG"},
    {"size": "7.5kg", "weight": 7.5, "price": 125.00, "stock": 10, "sku": "RP-7.5KG"}
]'::jsonb
WHERE slug = 'racao-racas-pequenas';

SELECT 
    name as produto,
    bag_options as opcoes_sacos
FROM products 
WHERE bag_options IS NOT NULL AND bag_options != '[]'::jsonb
ORDER BY name;
