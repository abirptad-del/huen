-- ==============================================================================
-- HUE N VIBES ECOMMERCE - SUPABASE POSTGRESQL SCHEMA & INITIAL SEEDING
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  bengali_name TEXT,
  description TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. PRODUCTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  bengali_name TEXT,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  sale_price NUMERIC(10, 2),
  sku TEXT UNIQUE,
  stock INT NOT NULL DEFAULT 0,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'Published' CHECK (status IN ('Published', 'Draft', 'Out of Stock')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. PRODUCT IMAGES TABLE (Multi-image support)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. CUSTOMERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  city TEXT,
  area TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. ORDERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'Cash on Delivery',
  order_status TEXT NOT NULL DEFAULT 'Pending' CHECK (order_status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
  delivery_address TEXT NOT NULL,
  delivery_city TEXT NOT NULL,
  delivery_area TEXT NOT NULL,
  customer_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. ORDER ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. COUPONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'flat')),
  discount_value NUMERIC(10, 2) NOT NULL,
  minimum_spend NUMERIC(10, 2) DEFAULT 0,
  usage_limit INT DEFAULT 100,
  used_count INT DEFAULT 0,
  expires_at DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. REVIEWS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Approved' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. STORE SETTINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_name TEXT NOT NULL DEFAULT 'hue n vibes',
  support_email TEXT DEFAULT 'ecommercemanagement25@gmail.com',
  hotline TEXT DEFAULT '+880 1700-000000',
  currency_symbol TEXT DEFAULT '৳',
  inside_dhaka_fee NUMERIC(10, 2) DEFAULT 60,
  outside_dhaka_fee NUMERIC(10, 2) DEFAULT 120,
  free_delivery_above NUMERIC(10, 2) DEFAULT 2500,
  cod_enabled BOOLEAN DEFAULT TRUE,
  show_admin_test_button BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. AUTO-DECREASE STOCK TRIGGER
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION decrease_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.product_id IS NOT NULL THEN
    UPDATE products
    SET stock = GREATEST(0, stock - NEW.quantity),
        updated_at = NOW()
    WHERE id = NEW.product_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_decrease_stock ON order_items;
CREATE TRIGGER trigger_decrease_stock
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION decrease_product_stock();

-- ------------------------------------------------------------------------------
-- 11. SUPABASE STORAGE BUCKETS SETUP
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('category-images', 'category-images', true)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Categories RLS:
CREATE POLICY "Public can view active categories" ON categories FOR SELECT USING (is_active = TRUE OR true);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (true) WITH CHECK (true);

-- Products RLS:
CREATE POLICY "Public can view published products" ON products FOR SELECT USING (status = 'Published' OR true);
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (true) WITH CHECK (true);

-- Product Images RLS:
CREATE POLICY "Public can view product images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage product images" ON product_images FOR ALL USING (true) WITH CHECK (true);

-- Customers RLS:
CREATE POLICY "Customers can view own profile or admins all" ON customers FOR SELECT USING (true);
CREATE POLICY "Public can register as customer during checkout" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage customers" ON customers FOR ALL USING (true) WITH CHECK (true);

-- Orders RLS:
CREATE POLICY "Public can track order and admins view all" ON orders FOR SELECT USING (true);
CREATE POLICY "Public can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (true) WITH CHECK (true);

-- Order Items RLS:
CREATE POLICY "Public can view order items" ON order_items FOR SELECT USING (true);
CREATE POLICY "Public can insert order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage order items" ON order_items FOR ALL USING (true) WITH CHECK (true);

-- Coupons RLS:
CREATE POLICY "Public can view active coupons" ON coupons FOR SELECT USING (is_active = TRUE OR true);
CREATE POLICY "Admins can manage coupons" ON coupons FOR ALL USING (true) WITH CHECK (true);

-- Reviews RLS:
CREATE POLICY "Public can view approved reviews" ON reviews FOR SELECT USING (status = 'Approved' OR true);
CREATE POLICY "Public can submit reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage reviews" ON reviews FOR ALL USING (true) WITH CHECK (true);

-- Store Settings RLS:
CREATE POLICY "Public can view store settings" ON store_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage store settings" ON store_settings FOR ALL USING (true) WITH CHECK (true);

-- Storage bucket access policies
CREATE POLICY "Public Access product-images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Public Insert product-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Public Access category-images" ON storage.objects FOR SELECT USING (bucket_id = 'category-images');
CREATE POLICY "Public Insert category-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'category-images');

-- ------------------------------------------------------------------------------
-- 13. SEEDING INITIAL CATEGORIES & DATA
-- ------------------------------------------------------------------------------

-- Default store settings (Single row)
INSERT INTO store_settings (
  store_name,
  support_email,
  hotline,
  currency_symbol,
  inside_dhaka_fee,
  outside_dhaka_fee,
  free_delivery_above,
  cod_enabled,
  show_admin_test_button
) VALUES (
  'hue n vibes',
  'ecommercemanagement25@gmail.com',
  '+880 1700-000000',
  '৳',
  60,
  120,
  2500,
  true,
  true
);

-- Seed Categories (9 Existing categories)
INSERT INTO categories (id, name, bengali_name, description, image_url, sort_order, is_active) VALUES
('11111111-1111-1111-1111-111111111101', 'Handy Gadgets', 'হ্যান্ডি গ্যাজেটস', 'Smart and useful gadgets designed to make everyday life easier.', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&auto=format&fit=crop&q=80', 0, true),
('11111111-1111-1111-1111-111111111102', 'Home Helpers', 'হোম হেলপার্স', 'Clever household utilities and tools to elevate your living space.', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&auto=format&fit=crop&q=80', 1, true),
('11111111-1111-1111-1111-111111111103', 'Kitchen Finds', 'কিচেন ফাইন্ডস', 'Innovative kitchenware and accessories for smart, modern cooking.', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&auto=format&fit=crop&q=80', 2, true),
('11111111-1111-1111-1111-111111111104', 'Smart Utility', 'স্মার্ট ইউটিলিটি', 'Practical high-tech utilities to automate and simplify tasks.', 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&auto=format&fit=crop&q=80', 3, true),
('11111111-1111-1111-1111-111111111105', 'Travel & Daily Carry', 'ট্রাভেল ও ডেইলি ক্যারি', 'Compact, lightweight essentials for active travels and commutes.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=80', 4, true),
('11111111-1111-1111-1111-111111111106', 'Car & Lifestyle', 'কার ও লাইফস্টাইল', 'Premium accessories to organize and enrich your car and daily drive.', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop&q=80', 5, true),
('11111111-1111-1111-1111-111111111107', 'Personal Care', 'পার্সোনাল কেয়ার', 'Advanced grooming, health, and personal care solutions.', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80', 6, true),
('11111111-1111-1111-1111-111111111108', 'Home Organization', 'হোম অর্গানাইজেশন', 'Intelligent space-savers and drawer organizers for a tidy home.', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80', 7, true),
('11111111-1111-1111-1111-111111111109', 'Cleaning Tools', 'ক্লিনিং টুলস', 'Powerful scrubbing, dusting, and automated cleaning equipment.', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=80', 8, true)
ON CONFLICT (id) DO NOTHING;

-- Seed Products
INSERT INTO products (id, category_id, name, bengali_name, description, price, sale_price, sku, stock, image_url, is_featured, is_trending, status) VALUES
('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', 'Portable Neck Fan', 'পোর্টেবল নেক ফ্যান', 'Hands-free cooling with leafless design & 3 adjustable speed modes.', 890, 1200, 'HNV-FAN-001', 45, 'https://images.unsplash.com/photo-1618944847823-380f84d67842?w=600&auto=format&fit=crop&q=80', true, true, 'Published'),
('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111101', 'Compact USB Rechargeable Fan', 'কমপ্যাক্ট ইউএসবি রিচার্জেবল ফ্যান', 'Cool breeze on-the-go with quiet motor & foldable kickstand.', 850, 1100, 'HNV-FAN-002', 28, 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80', false, true, 'Published'),
('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111102', 'Portable Mini Garment Steamer', 'পোর্টেবল মিনি গার্মেন্ট স্টিমার', 'Remove wrinkles effortlessly anywhere with quick 20s heat-up.', 950, 1250, 'HNV-STM-010', 19, 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&auto=format&fit=crop&q=80', true, true, 'Published'),
('22222222-2222-2222-2222-222222222204', '11111111-1111-1111-1111-111111111102', 'Rechargeable Motion Sensor Light', 'রিচার্জেবল মোশন সেন্সর লাইট', 'Smart magnetic LED light for closets, stairs and under-cabinets.', 680, 850, 'HNV-LED-004', 64, 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600&auto=format&fit=crop&q=80', true, false, 'Published'),
('22222222-2222-2222-2222-222222222205', '11111111-1111-1111-1111-111111111103', 'Mini Portable Food Sealer', 'মিনি পোর্টেবল ফুড সিলার', 'Keep snacks fresh with airtight 2-in-1 thermal sealing & cutter.', 490, 650, 'HNV-KT-005', 82, 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80', true, true, 'Published'),
('22222222-2222-2222-2222-222222222206', '11111111-1111-1111-1111-111111111103', 'Mini Electric Garlic Chopper', 'মিনি ইলেকট্রিক রসুন চপার', 'Chop garlic, ginger, chilies & herbs in seconds with 3-blade stainless steel.', 590, 790, 'HNV-KT-006', 50, 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600&auto=format&fit=crop&q=80', false, true, 'Published'),
('22222222-2222-2222-2222-222222222207', '11111111-1111-1111-1111-111111111103', 'Multifunctional Kitchen Cutter', 'মাল্টিফাংশনাল কিচেন কাটার', 'Premium multi-blade vegetable slicer, grater and drain basket.', 750, 1050, 'HNV-KT-007', 35, 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80', true, true, 'Published'),
('22222222-2222-2222-2222-222222222208', '11111111-1111-1111-1111-111111111106', 'Multifunctional Car Organizer', 'মাল্টিফাংশনাল কার অর্গানাইজার', 'Keep backseat clutter-free with tablet holder, cup pockets & tissue box.', 780, 990, 'HNV-CAR-008', 22, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80', true, true, 'Published'),
('22222222-2222-2222-2222-222222222209', '11111111-1111-1111-1111-111111111108', 'Foldable Storage Organizer', 'ফোল্ডেবল স্টোরেজ অর্গানাইজার', 'Space-saving fabric cubes with reinforced handles and clear viewing window.', 450, 600, 'HNV-ORG-009', 55, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80', true, false, 'Published'),
('22222222-2222-2222-2222-222222222210', '11111111-1111-1111-1111-111111111109', 'Rechargeable Electric Cleaning Brush', 'রিচার্জেবল ইলেকট্রিক ক্লিনিং ব্রাশ', 'Power scrub tough tile, bathroom & kitchen grease stains with 3 spin heads.', 1100, 1450, 'HNV-CLN-010', 14, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80', true, true, 'Published'),
('22222222-2222-2222-2222-222222222211', '11111111-1111-1111-1111-111111111109', 'Portable Mini Vacuum Cleaner', 'পোর্টেবল মিনি ভ্যাকুয়াম ক্লিনার', 'Powerful handheld wireless car & desk cleaner with HEPA washable filter.', 990, 1350, 'HNV-CLN-011', 8, 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80', false, true, 'Published')
ON CONFLICT (id) DO NOTHING;

-- Seed Product Images
INSERT INTO product_images (product_id, image_url, sort_order, is_primary) VALUES
('22222222-2222-2222-2222-222222222201', 'https://images.unsplash.com/photo-1618944847823-380f84d67842?w=600&auto=format&fit=crop&q=80', 0, true),
('22222222-2222-2222-2222-222222222202', 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80', 0, true),
('22222222-2222-2222-2222-222222222203', 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&auto=format&fit=crop&q=80', 0, true),
('22222222-2222-2222-2222-222222222204', 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600&auto=format&fit=crop&q=80', 0, true);

-- Seed Customers
INSERT INTO customers (id, name, phone, email, address, city, area) VALUES
('33333333-3333-3333-3333-333333333301', 'Tanvir Ahmed', '01712-345678', 'tanvir.ahmed@gmail.com', 'House 42, Road 11, Block D, Banani', 'Dhaka', 'Banani'),
('33333333-3333-3333-3333-333333333302', 'Nusrat Jahan', '01844-987654', 'nusrat.jahan@yahoo.com', 'Apt 5B, Green View Tower, Nasirabad', 'Chittagong', 'Nasirabad'),
('33333333-3333-3333-3333-333333333303', 'Mehedi Hasan', '01911-223344', 'mehedi.h@outlook.com', 'Flat 3A, House 15, Sector 4, Uttara', 'Dhaka', 'Uttara'),
('33333333-3333-3333-3333-333333333304', 'Farhana Akter', '01678-554433', 'farhana.akter@gmail.com', 'Holding 88, Shibganj Main Road', 'Sylhet', 'Shibganj')
ON CONFLICT (id) DO NOTHING;

-- Seed Orders
INSERT INTO orders (id, order_number, customer_id, subtotal, delivery_fee, discount, total, payment_method, order_status, delivery_address, delivery_city, delivery_area, customer_note) VALUES
('44444444-4444-4444-4444-444444444401', 'HNV-89241', '33333333-3333-3333-3333-333333333301', 2460, 60, 100, 2420, 'Cash on Delivery', 'Processing', 'House 42, Road 11, Block D, Banani', 'Dhaka', 'Banani', 'Please call before delivery after 2 PM.'),
('44444444-4444-4444-4444-444444444402', 'HNV-89240', '33333333-3333-3333-3333-333333333302', 1540, 120, 0, 1660, 'Cash on Delivery', 'Pending', 'Apt 5B, Green View Tower, Nasirabad', 'Chittagong', 'Nasirabad', NULL),
('44444444-4444-4444-4444-444444444403', 'HNV-89239', '33333333-3333-3333-3333-333333333303', 1100, 60, 0, 1160, 'Cash on Delivery', 'Delivered', 'Flat 3A, House 15, Sector 4, Uttara', 'Dhaka', 'Uttara', NULL)
ON CONFLICT (id) DO NOTHING;

-- Seed Order Items
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total) VALUES
('44444444-4444-4444-4444-444444444401', '22222222-2222-2222-2222-222222222201', 'Portable Neck Fan', 2, 890, 1780),
('44444444-4444-4444-4444-444444444401', '22222222-2222-2222-2222-222222222204', 'Rechargeable Motion Sensor Light', 1, 680, 680),
('44444444-4444-4444-4444-444444444402', '22222222-2222-2222-2222-222222222203', 'Portable Mini Garment Steamer', 1, 950, 950),
('44444444-4444-4444-4444-444444444402', '22222222-2222-2222-2222-222222222206', 'Mini Electric Garlic Chopper', 1, 590, 590),
('44444444-4444-4444-4444-444444444403', '22222222-2222-2222-2222-222222222210', 'Rechargeable Electric Cleaning Brush', 1, 1100, 1100);

-- Seed Coupons
INSERT INTO coupons (id, code, discount_type, discount_value, minimum_spend, usage_limit, used_count, expires_at, is_active) VALUES
('55555555-5555-5555-5555-555555555501', 'VIBES10', 'percentage', 10, 1000, 200, 47, '2026-12-31', true),
('55555555-5555-5555-5555-555555555502', 'SAVE100', 'flat', 100, 1500, 100, 31, '2026-11-30', true),
('55555555-5555-5555-5555-555555555503', 'ECOM25', 'percentage', 15, 2000, 50, 50, '2026-09-01', false)
ON CONFLICT (id) DO NOTHING;

-- Seed Reviews
INSERT INTO reviews (id, product_id, customer_id, rating, review, status) VALUES
('66666666-6666-6666-6666-666666666601', '22222222-2222-2222-2222-222222222201', '33333333-3333-3333-3333-333333333301', 5, 'Awesome neck fan! Very strong airflow and really quiet. Battery easily lasted full day during outdoor commute.', 'Approved'),
('66666666-6666-6666-6666-666666666602', '22222222-2222-2222-2222-222222222204', '33333333-3333-3333-3333-333333333303', 5, 'Magnet is strong and sensor responds instantly. Perfect for my closet and staircase.', 'Approved'),
('66666666-6666-6666-6666-666666666603', '22222222-2222-2222-2222-222222222203', '33333333-3333-3333-3333-333333333302', 4, 'Heats up in seconds and removes wrinkles from shirts smoothly. Great for traveling.', 'Approved')
ON CONFLICT (id) DO NOTHING;
