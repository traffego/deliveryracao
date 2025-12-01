-- =====================================================
-- Migration 005: Add Bag Options for Products
-- =====================================================

-- Adicionar campo para opções de sacos fechados
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS bag_options JSONB DEFAULT '[]';

COMMENT ON COLUMN public.products.bag_options IS 'Array de opções de sacos: [{size: "1kg", price: 15.00, stock: 10}, {size: "3kg", price: 42.00, stock: 5}]';

-- Exemplo de como ficará o JSONB:
-- [
--   {"size": "1kg", "weight": 1, "price": 15.00, "stock": 10, "sku": "PP-1KG"},
--   {"size": "3kg", "weight": 3, "price": 42.00, "stock": 5, "sku": "PP-3KG"},
--   {"size": "15kg", "weight": 15, "price": 165.00, "stock": 30, "sku": "PP-15KG"}
-- ]
