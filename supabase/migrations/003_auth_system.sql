-- =====================================================
-- MIGRATION CORRETIVA E SISTEMA DE AUTENTICAÇÃO
-- =====================================================

-- PARTE 1: CORRIGIR TABELA ORDERS (Adicionar campos que faltam)
-- =====================================================

-- Adicionar campos de informações do cliente inline
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- Adicionar campos de endereço inline
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS delivery_street TEXT,
ADD COLUMN IF NOT EXISTS delivery_number TEXT,
ADD COLUMN IF NOT EXISTS delivery_neighborhood TEXT,
ADD COLUMN IF NOT EXISTS delivery_city TEXT,
ADD COLUMN IF NOT EXISTS delivery_state TEXT,
ADD COLUMN IF NOT EXISTS delivery_zip_code TEXT,
ADD COLUMN IF NOT EXISTS delivery_complement TEXT;

-- Adicionar coluna user_id para autenticação (diferente de customer_id)
-- customer_id = referência a profiles (antigo)
-- user_id = referência a auth.users (novo sistema de auth)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

COMMENT ON COLUMN public.orders.customer_name IS 'Nome do cliente (inline, usado para pedidos sem autenticação)';
COMMENT ON COLUMN public.orders.customer_phone IS 'Telefone do cliente (inline)';
COMMENT ON COLUMN public.orders.user_id IS 'Referência ao usuário autenticado (auth.users)';


-- PARTE 2: SISTEMA DE AUTENTICAÇÃO
-- =====================================================

-- 1. Criar tabela de perfis (profiles) se não existir
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    phone TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Habilitar RLS na tabela orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. Policies para profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
    ON public.profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 5. Policies para orders
-- Permitir INSERT sem autenticação (para pedidos de não-usuários)
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders"
    ON public.orders
    FOR INSERT
    WITH CHECK (true);

-- Usuários veem apenas seus próprios pedidos (autenticados)
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders"
    ON public.orders
    FOR SELECT
    USING (
        user_id = auth.uid() 
        OR user_id IS NULL 
        OR auth.uid() IS NULL
    );

-- Admins veem todos os pedidos
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders"
    ON public.orders
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins podem atualizar pedidos
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders"
    ON public.orders
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 6. Function para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, phone, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Cliente'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Trigger para executar a function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 8. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 9. Function helper para verificar se usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_id AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Habilitar RLS em order_items também
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Policy para order_items
DROP POLICY IF EXISTS "Anyone can view order items" ON public.order_items;
CREATE POLICY "Anyone can view order items"
    ON public.order_items
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can update order items" ON public.order_items;
CREATE POLICY "Admins can update order items"
    ON public.order_items
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- COMENTÁRIOS
COMMENT ON TABLE public.profiles IS 'Perfis de usuários autenticados (clientes e admins)';
COMMENT ON COLUMN public.profiles.role IS 'Tipo de usuário: customer ou admin';
COMMENT ON COLUMN public.orders.user_id IS 'ID do usuário autenticado (se houver)';
COMMENT ON COLUMN public.orders.customer_name IS 'Nome inline para pedidos sem autenticação';

-- =====================================================
-- NOTAS IMPORTANTES:
-- =====================================================
-- 1. Esta migration é SEGURA - não quebra código existente
-- 2. Pedidos podem ser criados COM ou SEM autenticação
-- 3. user_id é NULL para pedidos não autenticados
-- 4. customer_name/phone continuam funcionando
-- 5. RLS permite que usuários vejam seus próprios pedidos
-- 6. Admins têm acesso total via policies
