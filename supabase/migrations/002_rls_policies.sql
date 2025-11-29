-- =====================================================
-- Migration 002: Row Level Security (RLS) Policies
-- Sistema de Delivery - Loja de Ração
-- =====================================================

-- Enable RLS on all tables
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
-- STORES POLICIES
-- =====================================================

-- Everyone can view active stores
CREATE POLICY "Anyone can view active stores"
  ON stores FOR SELECT
  USING (is_active = true);

-- Only main admin or store merchants can update their store
CREATE POLICY "Merchants can update their store"
  ON stores FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE store_id = stores.id 
      AND role IN ('merchant', 'admin')
    )
  );

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Merchants can view profiles in their store
CREATE POLICY "Merchants can view store profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.store_id = profiles.store_id
      AND p.role IN ('merchant', 'admin')
    )
  );

-- =====================================================
-- ADDRESSES POLICIES
-- =====================================================

-- Users can view their own addresses
CREATE POLICY "Users can view own addresses"
  ON addresses FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own addresses
CREATE POLICY "Users can insert own addresses"
  ON addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own addresses
CREATE POLICY "Users can update own addresses"
  ON addresses FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own addresses
CREATE POLICY "Users can delete own addresses"
  ON addresses FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- CATEGORIES POLICIES
-- =====================================================

-- Everyone can view active categories
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (is_active = true);

-- Only admins can manage categories
CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- =====================================================
-- PRODUCTS POLICIES
-- =====================================================

-- Everyone can view active products
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = true);

-- Merchants can view all products in their store
CREATE POLICY "Merchants can view store products"
  ON products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND store_id = products.store_id
      AND role IN ('merchant', 'admin')
    )
  );

-- Merchants can insert products in their store
CREATE POLICY "Merchants can insert products"
  ON products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND store_id = products.store_id
      AND role IN ('merchant', 'admin')
    )
  );

-- Merchants can update products in their store
CREATE POLICY "Merchants can update products"
  ON products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND store_id = products.store_id
      AND role IN ('merchant', 'admin')
    )
  );

-- Merchants can delete products in their store
CREATE POLICY "Merchants can delete products"
  ON products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND store_id = products.store_id
      AND role IN ('merchant', 'admin')
    )
  );

-- =====================================================
-- ORDERS POLICIES
-- =====================================================

-- Customers can view their own orders
CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = customer_id);

-- Merchants can view orders in their store
CREATE POLICY "Merchants can view store orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND store_id = orders.store_id
      AND role IN ('merchant', 'admin', 'delivery')
    )
  );

-- Customers can insert their own orders
CREATE POLICY "Customers can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

-- Merchants can update orders in their store
CREATE POLICY "Merchants can update store orders"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND store_id = orders.store_id
      AND role IN ('merchant', 'admin', 'delivery')
    )
  );

-- =====================================================
-- ORDER ITEMS POLICIES
-- =====================================================

-- Users can view order items if they can view the order
CREATE POLICY "Users can view order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (
        orders.customer_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.store_id = orders.store_id
          AND profiles.role IN ('merchant', 'admin', 'delivery')
        )
      )
    )
  );

-- Customers can insert order items for their orders
CREATE POLICY "Customers can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.customer_id = auth.uid()
    )
  );

-- =====================================================
-- ORDER STATUS HISTORY POLICIES
-- =====================================================

-- Users can view order status history if they can view the order
CREATE POLICY "Users can view order history"
  ON order_status_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_status_history.order_id
      AND (
        orders.customer_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.store_id = orders.store_id
          AND profiles.role IN ('merchant', 'admin', 'delivery')
        )
      )
    )
  );

-- =====================================================
-- DELIVERY SETTINGS POLICIES
-- =====================================================

-- Everyone can view delivery settings for active stores
CREATE POLICY "Anyone can view delivery settings"
  ON delivery_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = delivery_settings.store_id
      AND stores.is_active = true
    )
  );

-- Merchants can update their store's delivery settings
CREATE POLICY "Merchants can update delivery settings"
  ON delivery_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND store_id = delivery_settings.store_id
      AND role IN ('merchant', 'admin')
    )
  );

-- =====================================================
-- PAYMENT SETTINGS POLICIES
-- =====================================================

-- Only merchants can view their store's payment settings
CREATE POLICY "Merchants can view payment settings"
  ON payment_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND store_id = payment_settings.store_id
      AND role IN ('merchant', 'admin')
    )
  );

-- Only merchants can update their store's payment settings
CREATE POLICY "Merchants can update payment settings"
  ON payment_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND store_id = payment_settings.store_id
      AND role IN ('merchant', 'admin')
    )
  );
