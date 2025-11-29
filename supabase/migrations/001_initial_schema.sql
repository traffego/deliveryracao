-- =====================================================
-- Migration 001: Initial Schema
-- Sistema de Delivery - Loja de Ração
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- STORES TABLE (Multi-tenant)
-- =====================================================
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  
  -- Contact
  phone TEXT,
  email TEXT,
  whatsapp TEXT,
  
  -- Physical address
  street TEXT,
  number TEXT,
  complement TEXT,
  neighborhood TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Settings
  is_active BOOLEAN DEFAULT true,
  is_main_admin BOOLEAN DEFAULT false,
  
  -- Business hours (JSONB)
  business_hours JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Only one store can be main admin
CREATE UNIQUE INDEX idx_stores_main_admin ON stores (is_main_admin) WHERE is_main_admin = true;

-- =====================================================
-- PROFILES TABLE (Extends auth.users)
-- =====================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer', -- 'customer', 'merchant', 'admin', 'delivery'
  avatar_url TEXT,
  
  -- Store relationship (for merchants/delivery)
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ADDRESSES TABLE
-- =====================================================
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

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================
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

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  
  -- Product type
  product_type TEXT NOT NULL, -- 'bulk' or 'packaged'
  
  -- Pricing and stock
  price DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL, -- 'kg' for bulk, 'un' for packaged
  package_weight DECIMAL(10, 2),
  
  -- Order mode (IMPORTANT for "order by value" feature)
  order_mode TEXT NOT NULL DEFAULT 'quantity', -- 'quantity', 'value', 'both'
  min_order_value DECIMAL(10, 2),
  min_order_quantity DECIMAL(10, 2),
  
  stock_quantity DECIMAL(10, 2) NOT NULL DEFAULT 0,
  min_stock_alert DECIMAL(10, 2) DEFAULT 10,
  
  -- Images
  images JSONB DEFAULT '[]',
  
  -- Additional info
  brand TEXT,
  sku TEXT,
  
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(store_id, slug),
  UNIQUE(store_id, sku)
);

-- =====================================================
-- ORDERS TABLE
-- =====================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Delivery address
  delivery_address_id UUID REFERENCES addresses(id),
  delivery_type TEXT NOT NULL, -- 'delivery' or 'pickup'
  
  -- Delivery person
  delivery_person_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending',
  -- 'pending', 'confirmed', 'preparing', 'ready', 'in_transit', 'delivered', 'cancelled'
  
  -- Values
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  
  -- Payment
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  payment_id TEXT,
  
  -- Cash payment with change
  cash_payment_amount DECIMAL(10, 2),
  cash_change_amount DECIMAL(10, 2),
  
  -- Repeat order flag
  is_repeat_order BOOLEAN DEFAULT false,
  original_order_id UUID REFERENCES orders(id),
  
  -- Notes
  customer_notes TEXT,
  internal_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- =====================================================
-- ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  
  product_name TEXT NOT NULL,
  product_type TEXT NOT NULL,
  
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  
  -- Order type control
  order_type TEXT NOT NULL, -- 'by_quantity' or 'by_value'
  requested_value DECIMAL(10, 2),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ORDER STATUS HISTORY TABLE
-- =====================================================
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DELIVERY SETTINGS TABLE (per store)
-- =====================================================
CREATE TABLE delivery_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  
  -- Delivery mode
  delivery_mode TEXT NOT NULL, -- 'fixed_general', 'fixed_by_zone', 'distance_based'
  
  -- Fixed general fee
  fixed_general_fee DECIMAL(10, 2),
  
  -- Delivery zones (if fixed_by_zone)
  delivery_zones JSONB DEFAULT '[]',
  
  -- Distance-based calculation
  distance_base_fee DECIMAL(10, 2),
  distance_per_km_fee DECIMAL(10, 2),
  distance_free_km DECIMAL(10, 2),
  
  -- Free delivery threshold
  free_delivery_min_value DECIMAL(10, 2),
  
  -- Estimated delivery time
  estimated_delivery_time_min INT DEFAULT 30,
  estimated_delivery_time_max INT DEFAULT 60,
  
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(store_id)
);

-- =====================================================
-- PAYMENT SETTINGS TABLE (per store)
-- =====================================================
CREATE TABLE payment_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  
  -- Mercado Pago
  mercadopago_enabled BOOLEAN DEFAULT false,
  mercadopago_public_key TEXT,
  mercadopago_access_token TEXT,
  
  -- Efibank
  efibank_enabled BOOLEAN DEFAULT false,
  efibank_client_id TEXT,
  efibank_client_secret TEXT,
  efibank_pix_enabled BOOLEAN DEFAULT true,
  efibank_boleto_enabled BOOLEAN DEFAULT false,
  efibank_card_enabled BOOLEAN DEFAULT false,
  
  -- Cash on delivery
  cash_on_delivery_enabled BOOLEAN DEFAULT true,
  card_on_delivery_enabled BOOLEAN DEFAULT true,
  
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(store_id)
);

-- =====================================================
-- INDEXES
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
-- TRIGGERS
-- =====================================================

-- Update updated_at timestamp
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

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add order status to history on update
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
