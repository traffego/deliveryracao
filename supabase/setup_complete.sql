-- =====================================================
-- SETUP COMPLETO - Sistema de Delivery Loja de Ração
-- Execute este script INTEIRO no SQL Editor do Supabase
-- =====================================================

-- PASSO 1: Criar Schema Inicial
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- STORES TABLE (Multi-tenant)
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  phone TEXT,
  email TEXT,
  whatsapp TEXT,
  street TEXT,
  number TEXT,
  complement TEXT,
  neighborhood TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true,
  is_main_admin BOOLEAN DEFAULT false,
  business_hours JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_stores_main_admin ON stores (is_main_admin) WHERE is_main_admin = true;

-- PROFILES TABLE
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ADDRESSES TABLE
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT,
  street TEXT NOT NULL,
  number TEXT NOT NULL,
  complement TEXT,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CATEGORIES TABLE
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTS TABLE 
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  product_type TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL,
  package_weight DECIMAL(10, 2),
  order_mode TEXT NOT NULL DEFAULT 'quantity',
  min_order_value DECIMAL(10, 2),
  min_order_quantity DECIMAL(10, 2),
  stock_quantity DECIMAL(10, 2) NOT NULL DEFAULT 0,
  min_stock_alert DECIMAL(10, 2) DEFAULT 10,
  images JSONB DEFAULT '[]',
  brand TEXT,
  sku TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(store_id, slug),
  UNIQUE(store_id, sku)
);

-- ORDERS TABLE
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  delivery_address_id UUID REFERENCES addresses(id),
  delivery_type TEXT NOT NULL,
  delivery_person_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  payment_id TEXT,
  cash_payment_amount DECIMAL(10, 2),
  cash_change_amount DECIMAL(10, 2),
  is_repeat_order BOOLEAN DEFAULT false,
  original_order_id UUID REFERENCES orders(id),
  customer_notes TEXT,
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- ORDER ITEMS TABLE
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_type TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  order_type TEXT NOT NULL,
  requested_value DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDER STATUS HISTORY TABLE
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DELIVERY SETTINGS TABLE
CREATE TABLE delivery_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  delivery_mode TEXT NOT NULL,
  fixed_general_fee DECIMAL(10, 2),
  delivery_zones JSONB DEFAULT '[]',
  distance_base_fee DECIMAL(10, 2),
  distance_per_km_fee DECIMAL(10, 2),
  distance_free_km DECIMAL(10, 2),
  free_delivery_min_value DECIMAL(10, 2),
  estimated_delivery_time_min INT DEFAULT 30,
  estimated_delivery_time_max INT DEFAULT 60,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(store_id)
);

-- PAYMENT SETTINGS TABLE
CREATE TABLE payment_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  mercadopago_enabled BOOLEAN DEFAULT false,
  mercadopago_public_key TEXT,
  mercadopago_access_token TEXT,
  efibank_enabled BOOLEAN DEFAULT false,
  efibank_client_id TEXT,
  efibank_client_secret TEXT,
  efibank_pix_enabled BOOLEAN DEFAULT true,
  efibank_boleto_enabled BOOLEAN DEFAULT false,
  efibank_card_enabled BOOLEAN DEFAULT false,
  cash_on_delivery_enabled BOOLEAN DEFAULT true,
  card_on_delivery_enabled BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(store_id)
);

-- =====================================================
-- PASSO 2: Criar Índices
-- =====================================================
CREATE INDEX idx_profiles_store_id ON profiles(store_id);
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_slug ON products(store_id, slug);
CREATE INDEX idx_orders_store_id ON orders(store_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);

-- =====================================================
-- PASSO 3: Criar Triggers
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION track_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_status_history (order_id, status, notes)
    VALUES (NEW.id, NEW.status, 'Status changed from ' || OLD.status || ' to ' || NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_order_status_changed
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION track_order_status_change();

-- =====================================================
-- PASSO 4: Habilitar RLS
-- =====================================================
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PASSO 5: Políticas RLS (Segurança)
-- =====================================================

-- STORES
CREATE POLICY "view_active_stores" ON stores FOR SELECT USING (is_active = true);
CREATE POLICY "merchants_update_store" ON stores FOR UPDATE 
  USING (auth.uid() IN (SELECT id FROM profiles WHERE store_id = stores.id AND role IN ('merchant', 'admin')));

-- PROFILES
CREATE POLICY "view_own_profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- ADDRESSES
CREATE POLICY "view_own_addresses" ON addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_own_addresses" ON addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_addresses" ON addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delete_own_addresses" ON addresses FOR DELETE USING (auth.uid() = user_id);

-- CATEGORIES
CREATE POLICY "view_categories" ON categories FOR SELECT USING (is_active = true);

-- PRODUCTS
CREATE POLICY "view_active_products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "merchants_manage_products" ON products FOR ALL 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND store_id = products.store_id AND role IN ('merchant', 'admin')));

-- ORDERS
CREATE POLICY "view_own_orders" ON orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "merchants_view_orders" ON orders FOR SELECT 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND store_id = orders.store_id AND role IN ('merchant', 'admin', 'delivery')));
CREATE POLICY "create_own_orders" ON orders FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "merchants_update_orders" ON orders FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND store_id = orders.store_id AND role IN ('merchant', 'admin', 'delivery')));

-- ORDER ITEMS
CREATE POLICY "view_order_items" ON order_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.customer_id = auth.uid()));
CREATE POLICY "insert_order_items" ON order_items FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.customer_id = auth.uid()));

-- DELIVERY SETTINGS
CREATE POLICY "view_delivery_settings" ON delivery_settings FOR SELECT 
  USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = delivery_settings.store_id AND stores.is_active = true));
CREATE POLICY "merchants_manage_delivery" ON delivery_settings FOR ALL 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND store_id = delivery_settings.store_id AND role IN ('merchant', 'admin')));

-- PAYMENT SETTINGS
CREATE POLICY "merchants_manage_payments" ON payment_settings FOR ALL 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND store_id = payment_settings.store_id AND role IN ('merchant', 'admin')));

-- =====================================================
-- ✅ SETUP COMPLETO!
-- =====================================================
