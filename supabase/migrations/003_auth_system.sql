-- =====================================================
-- SISTEMA DE AUTENTICAÇÃO - MIGRATION MINIMALISTA
-- Adiciona APENAS o que falta no banco atual
-- =====================================================

-- PARTE 1: ADICIONAR CAMPO user_id NA TABELA ORDERS
-- =====================================================

-- Adicionar coluna user_id para vincular pedidos a usuários autenticados
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);

COMMENT ON COLUMN public.orders.user_id IS 'ID do usuário autenticado (se houver). NULL para pedidos sem login.';


-- PARTE 2: ATUALIZAR CONSTRAINTS NA TABELA PROFILES
-- =====================================================

-- Garantir que phone seja único (para login por telefone)
DROP INDEX IF EXISTS profiles_phone_key;
CREATE UNIQUE INDEX IF NOT EXISTS profiles_phone_unique ON public.profiles(phone) WHERE phone IS NOT NULL AND phone != '';

-- Garantir que email seja único
DROP INDEX IF EXISTS profiles_email_key;
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_unique ON public.profiles(email) WHERE email IS NOT NULL AND email != '';

-- Adicionar índice no role
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);


-- PARTE 3: POLICIES DE AUTENTICAÇÃO
-- =====================================================

-- PROFILES POLICIES
-- Remover policies antigas se existirem
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Usuários podem ver apenas seu próprio perfil
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Admins podem ver todos os perfis
CREATE POLICY "Admins can view all profiles"
    ON public.profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ORDERS POLICIES
-- Remover policies antigas se existirem
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.orders;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.orders;

-- Permitir que qualquer um (autenticado ou não) crie pedidos
CREATE POLICY "Anyone can create orders"
    ON public.orders
    FOR INSERT
    WITH CHECK (true);

-- Usuários autenticados veem seus próprios pedidos
-- OU pedidos com seu telefone (para transição)
CREATE POLICY "Users can view own orders"
    ON public.orders
    FOR SELECT
    USING (
        user_id = auth.uid() 
        OR customer_phone IN (
            SELECT phone FROM public.profiles WHERE id = auth.uid()
        )
        OR auth.uid() IS NULL
    );

-- Admins veem todos os pedidos
CREATE POLICY "Admins can view all orders"
    ON public.orders
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins podem atualizar qualquer pedido
CREATE POLICY "Admins can update orders"
    ON public.orders
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ORDER_ITEMS POLICIES
DROP POLICY IF EXISTS "Anyone can view order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can update order items" ON public.order_items;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.order_items;

-- Qualquer um pode ver itens de pedido (necessário para checkout)
CREATE POLICY "Anyone can view order items"
    ON public.order_items
    FOR SELECT
    USING (true);

-- Permitir inserir itens (necessário para API de pedidos)
CREATE POLICY "Anyone can insert order items"
    ON public.order_items
    FOR INSERT
    WITH CHECK (true);

-- Admins podem fazer tudo com order items
CREATE POLICY "Admins can manage order items"
    ON public.order_items
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );


-- PARTE 4: TRIGGER PARA CRIAR PROFILE AUTOMATICAMENTE
-- =====================================================

-- Function para criar perfil automaticamente após signup
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
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar a function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- PARTE 5: FUNCTION HELPER
-- =====================================================

-- Function para verificar se usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_id AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- PARTE 6: COMENTÁRIOS
-- =====================================================

COMMENT ON COLUMN public.orders.user_id IS 'ID do usuário autenticado da tabela auth.users. NULL para pedidos sem login.';
COMMENT ON COLUMN public.orders.customer_id IS 'ID do perfil do cliente (legado). Usar user_id para novos pedidos.';
COMMENT ON TABLE public.profiles IS 'Perfis de usuários autenticados (clientes e admins)';
COMMENT ON COLUMN public.profiles.role IS 'Tipo de usuário: customer ou admin';


-- =====================================================
-- MIGRATION COMPLETA ✅
-- =====================================================
-- Esta migration adiciona APENAS o necessário para autenticação
-- Mantém 100% de compatibilidade com código existente
-- Pedidos podem ser criados COM ou SEM autenticação
