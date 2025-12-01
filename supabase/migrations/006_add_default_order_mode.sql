-- =====================================================
-- Migration 006: Add Default Order Mode Configuration
-- =====================================================

-- Adicionar campo para modo de pedido padrão (configurável pelo admin)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS default_order_mode TEXT DEFAULT 'value';

-- Constraint para garantir valores válidos
ALTER TABLE public.products
ADD CONSTRAINT check_default_order_mode 
CHECK (default_order_mode IN ('value', 'quantity', 'bag'));

COMMENT ON COLUMN public.products.default_order_mode IS 'Modo de pedido padrão ao abrir a página do produto: value, quantity ou bag';

-- Atualizar produtos existentes para usar 'value' como padrão
UPDATE products 
SET default_order_mode = 'value'
WHERE default_order_mode IS NULL;
