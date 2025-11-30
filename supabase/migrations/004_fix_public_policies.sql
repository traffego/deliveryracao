-- =====================================================
-- CORRIGIR POLICIES - PERMITIR LEITURA PÚBLICA
-- =====================================================

-- PRODUCTS - Permitir leitura pública (para vitrine)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;
CREATE POLICY "Enable read access for all users"
    ON public.products
    FOR SELECT
    USING (true);

-- CATEGORIES - Permitir leitura pública
DROP POLICY IF EXISTS "Enable read access for all users" ON public.categories;
CREATE POLICY "Enable read access for all users"
    ON public.categories
    FOR SELECT
    USING (true);

-- STORES - Permitir leitura pública
DROP POLICY IF EXISTS "Enable read access for all users" ON public.stores;
CREATE POLICY "Enable read access for all users"
    ON public.stores
    FOR SELECT
    USING (true);

-- DELIVERY_SETTINGS - Permitir leitura pública
DROP POLICY IF EXISTS "Enable read access for all users" ON public.delivery_settings;
CREATE POLICY "Enable read access for all users"
    ON public.delivery_settings
    FOR SELECT
    USING (true);

-- PAYMENT_SETTINGS - Permitir leitura pública
DROP POLICY IF EXISTS "Enable read access for all users" ON public.payment_settings;
CREATE POLICY "Enable read access for all users"
    ON public.payment_settings
    FOR SELECT
    USING (true);

-- ADDRESSES - Usuários veem apenas seus endereços
DROP POLICY IF EXISTS "Users can view own addresses" ON public.addresses;
CREATE POLICY "Users can view own addresses"
    ON public.addresses
    FOR SELECT
    USING (user_id = auth.uid() OR auth.uid() IS NULL);

-- ORDER_STATUS_HISTORY - Permitir leitura para todos
DROP POLICY IF EXISTS "Enable read access for all users" ON public.order_status_history;
CREATE POLICY "Enable read access for all users"
    ON public.order_status_history
    FOR SELECT
    USING (true);

-- Admins podem gerenciar produtos
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products"
    ON public.products
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins podem gerenciar categorias
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories"
    ON public.categories
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins podem gerenciar lojas
DROP POLICY IF EXISTS "Admins can manage stores" ON public.stores;
CREATE POLICY "Admins can manage stores"
    ON public.stores
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
