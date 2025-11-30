-- Add guest customer fields to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS delivery_street TEXT,
ADD COLUMN IF NOT EXISTS delivery_number TEXT,
ADD COLUMN IF NOT EXISTS delivery_neighborhood TEXT,
ADD COLUMN IF NOT EXISTS delivery_city TEXT,
ADD COLUMN IF NOT EXISTS delivery_state TEXT,
ADD COLUMN IF NOT EXISTS delivery_zip_code TEXT,
ADD COLUMN IF NOT EXISTS delivery_complement TEXT;
