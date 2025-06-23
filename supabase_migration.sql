-- Supabase Migration Script
-- Run this in your Supabase SQL Editor to create tables and import data

-- Create tables
CREATE TABLE IF NOT EXISTS cars (
  id SERIAL PRIMARY KEY,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  mileage INTEGER NOT NULL,
  color TEXT NOT NULL,
  fuel_type TEXT NOT NULL,
  transmission TEXT NOT NULL,
  condition TEXT NOT NULL,
  status TEXT DEFAULT 'available',
  images TEXT[] DEFAULT '{}',
  description TEXT,
  vin TEXT,
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  interior_color TEXT,
  drivetrain TEXT,
  body_style TEXT,
  engine TEXT,
  trim TEXT,
  number_of_seats INTEGER,
  number_of_doors INTEGER,
  mpg_city INTEGER,
  mpg_highway INTEGER,
  safety_rating TEXT,
  dealer_rating DECIMAL(3,2),
  days_on_market INTEGER,
  vehicle_history TEXT,
  financing_available BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  duration TEXT,
  category TEXT,
  features TEXT[] DEFAULT '{}',
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  image_url TEXT,
  approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_bookings (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  vehicle_info TEXT NOT NULL,
  service_type TEXT NOT NULL,
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);

CREATE TABLE IF NOT EXISTS admin_credentials (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  recovery_code TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert data
INSERT INTO cars (id, make, model, year, price, mileage, color, fuel_type, transmission, condition, status, images, description, vin, features, created_at, interior_color, drivetrain, body_style, engine, trim, number_of_seats, number_of_doors, mpg_city, mpg_highway, safety_rating, dealer_rating, days_on_market, vehicle_history, financing_available) VALUES
(5, 'Honda', 'Civic', 2019, 19999.00, 42000, 'Blue', 'Gasoline', 'Manual', 'used', 'available', ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&crop=center', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center'], 'Sporty Honda Civic in excellent condition', 'HON123456789012345', ARRAY['Honda Sensing Safety Suite', 'Adaptive Cruise Control', 'CVT Transmission'], '2025-06-11 23:13:25.958', 'Gray', 'FWD', 'Sedan', '2.0L 4-Cylinder', 'Sport', 5, 4, 31, 40, '5.0', 4.7, 8, 'Clean Title', true),
(6, 'Ford', 'F-150', 2021, 32999.00, 25000, 'Black', 'Gasoline', 'Automatic', 'used', 'available', ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center'], 'Powerful Ford F-150 pickup truck with excellent capability', 'FOR123456789012345', ARRAY['F-150 Tough', 'Best-in-Class Towing', 'BoxLink System'], '2025-06-11 23:13:25.958', 'Black', '4WD', 'Truck', '3.5L EcoBoost V6', 'XLT', 6, 4, 20, 24, '4.0', 4.9, 22, 'Clean Title', true),
(4, 'Toyota', 'Camry', 2020, 24999.00, 35000, 'Silver', 'Gasoline', 'Automatic', 'used', 'available', ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop&crop=center'], 'Well-maintained Toyota Camry with excellent fuel economy', 'TOY123456789012345', ARRAY['Fuel Efficient', 'Reliability Rating 5/5'], '2025-06-11 23:13:25.958', 'Black', 'FWD', 'Sedan', '2.0L 4-Cylinder', 'LE', 5, 4, 28, 39, '5.0', 4.8, 15, 'Clean Title', true),
(7, 'BMW', 'X3', 2022, 42999.00, 18000, 'White', 'Gasoline', 'Automatic', 'used', 'available', ARRAY['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&crop=center'], 'Luxury BMW X3 with premium features and AWD capability', 'BMW123456789012345', ARRAY['Leather Seats', 'Heated Front Seats', 'Navigation System'], '2025-06-11 23:13:25.958', 'Brown', 'AWD', 'SUV', '3.0L Twin Turbo I6', 'xDrive30i', 5, 4, 23, 29, '5.0', 4.6, 5, 'Clean Title', true),
(8, 'Tesla', 'Model 3', 2023, 38999.00, 12000, 'Red', 'Electric', 'Automatic', 'used', 'available', ARRAY['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&crop=center'], 'Latest Tesla Model 3 with Autopilot and premium features', 'TES123456789012345', ARRAY['Autopilot', 'Supercharging', 'Premium Interior'], '2025-06-11 23:13:25.958', 'White', 'RWD', 'Sedan', 'Electric Motor', 'Standard Range Plus', 5, 4, 130, 120, '5.0', 4.9, 3, 'Clean Title', true),
(10, 'BMW', '540I', 2018, 32900.00, 67000, 'White', 'Gasoline', 'Automatic', 'used', 'available', ARRAY['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&crop=center'], 'Luxury BMW 540i with premium features', 'BMW540I123456789', ARRAY['Luxury Package', 'Navigation', 'Heated Seats'], '2025-06-12 06:51:49.024', 'Black', 'RWD', 'Sedan', '3.0L Turbo I6', 'Base', 5, 4, 22, 30, '4.5', 4.7, 12, 'Clean Title', true),
(11, 'manoj', 'ss', 2024, 90000.00, 450, 'red', 'Gasoline', 'Automatic', 'used', 'available', ARRAY[]::TEXT[], 'test', '12345678901234567', ARRAY[]::TEXT[], '2025-06-12 06:52:07.261', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true),
(9, 'Chevrolet', 'Malibu', 2019, 22999.00, 38000, 'Gray', 'Gasoline', 'Automatic', 'used', 'sold', ARRAY['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&crop=center'], 'Reliable Chevrolet Malibu with great fuel economy', 'CHE123456789012345', ARRAY['OnStar', 'Apple CarPlay', 'Android Auto'], '2025-06-11 23:13:25.958', 'Gray', 'FWD', 'Sedan', '1.5L Turbo 4-Cylinder', 'LT', 5, 4, 29, 36, '4.0', 4.5, 18, 'Clean Title', true);

INSERT INTO services (id, name, description, price, duration, category, features, image_url, created_at) VALUES
(1, 'Oil Change', 'Complete oil and filter change service', 49.99, '30 minutes', 'Maintenance', ARRAY['Synthetic Oil Available', 'Filter Replacement', 'Fluid Level Check'], 'https://images.unsplash.com/photo-1632823469372-6c3a701c4e8e?w=400&h=300&fit=crop', '2025-06-11 23:13:26.055'),
(2, 'Brake Inspection', 'Comprehensive brake system inspection', 75.00, '45 minutes', 'Safety', ARRAY['Brake Pad Check', 'Rotor Inspection', 'Brake Fluid Test'], 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', '2025-06-11 23:13:26.055'),
(3, 'Tire Rotation', 'Professional tire rotation and pressure check', 35.00, '20 minutes', 'Maintenance', ARRAY['Tire Pressure Check', 'Tread Inspection', 'Alignment Check'], 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '2025-06-11 23:13:26.055'),
(4, 'Battery Test', 'Battery and charging system diagnostic', 25.00, '15 minutes', 'Electrical', ARRAY['Load Test', 'Charging System Check', 'Terminal Cleaning'], 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop', '2025-06-11 23:13:26.055'),
(5, 'Air Filter Replacement', 'Engine and cabin air filter replacement', 65.00, '25 minutes', 'Maintenance', ARRAY['Engine Air Filter', 'Cabin Air Filter', 'Filter Quality Check'], 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=400&h=300&fit=crop', '2025-06-11 23:13:26.055'),
(6, 'Transmission Service', 'Complete transmission fluid and filter service', 149.99, '60 minutes', 'Drivetrain', ARRAY['Fluid Replacement', 'Filter Change', 'System Inspection'], 'https://images.unsplash.com/photo-1597404294360-feeeda04f042?w=400&h=300&fit=crop', '2025-06-11 23:13:26.055'),
(7, 'AC Service', 'Air conditioning system service and repair', 89.99, '45 minutes', 'Climate', ARRAY['Refrigerant Check', 'Leak Detection', 'System Cleaning'], 'https://images.unsplash.com/photo-1551522435-a13afa10f103?w=400&h=300&fit=crop', '2025-06-11 23:13:26.055'),
(8, 'Engine Diagnostic', 'Computer diagnostic scan and analysis', 99.99, '30 minutes', 'Diagnostic', ARRAY['OBD-II Scan', 'Error Code Analysis', 'Performance Check'], 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400&h=300&fit=crop', '2025-06-11 23:13:26.055'),
(9, 'Coolant Flush', 'Complete cooling system flush and fill', 79.99, '40 minutes', 'Maintenance', ARRAY['System Flush', 'New Coolant', 'Thermostat Check'], 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&h=300&fit=crop', '2025-06-11 23:13:26.055'),
(10, 'Wheel Alignment', 'Precision wheel alignment service', 129.99, '60 minutes', 'Alignment', ARRAY['4-Wheel Alignment', 'Suspension Check', 'Tire Wear Analysis'], 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop', '2025-06-11 23:13:26.055'),
(11, 'Spark Plug Replacement', 'Complete spark plug and ignition service', 119.99, '45 minutes', 'Engine', ARRAY['Premium Spark Plugs', 'Ignition Coil Check', 'Performance Test'], 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop', '2025-06-11 23:13:26.055'),
(12, 'Belt Replacement', 'Serpentine belt inspection and replacement', 95.00, '35 minutes', 'Engine', ARRAY['Belt Inspection', 'Tensioner Check', 'Pulley Alignment'], 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop', '2025-06-11 23:13:26.055'),
(13, 'Exhaust Inspection', 'Complete exhaust system inspection', 65.00, '30 minutes', 'Emissions', ARRAY['Muffler Check', 'Pipe Inspection', 'Emissions Test'], 'https://images.unsplash.com/photo-1501066027896-2bab1b84adb0?w=400&h=300&fit=crop', '2025-06-11 23:13:26.055');

INSERT INTO testimonials (id, name, role, content, rating, image_url, approved, created_at) VALUES
(1, 'Sarah Johnson', 'Customer', 'Excellent service! They found exactly what I was looking for and the buying process was smooth and professional.', 5, 'https://images.unsplash.com/photo-1494790108755-2616b332faa6?w=150&h=150&fit=crop&crop=face', true, '2025-06-11 23:13:26.081'),
(2, 'Mike Chen', 'Customer', 'Great experience buying my used Honda Civic. The team was honest about the vehicle condition and pricing was fair.', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', true, '2025-06-11 23:13:26.081'),
(3, 'Jennifer Martinez', 'Customer', 'Outstanding customer service! They went above and beyond to help me find the perfect car within my budget.', 5, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', true, '2025-06-11 23:13:26.081'),
(4, 'David Wilson', 'Customer', 'Professional and reliable. My Ford F-150 has been running perfectly since purchase. Highly recommended!', 5, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', true, '2025-06-11 23:13:26.081'),
(5, 'Lisa Thompson', 'Customer', 'Transparent pricing and honest service. They helped me understand exactly what I was buying.', 4, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', true, '2025-06-11 23:13:26.081'),
(6, 'Robert Garcia', 'Customer', 'Fast and efficient service department. My BMW X3 maintenance was completed on time and within budget.', 5, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', true, '2025-06-11 23:13:26.081'),
(7, 'Amanda Lee', 'Customer', 'Excellent selection of quality used vehicles. Found my dream car at a great price!', 5, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face', true, '2025-06-11 23:13:26.081'),
(8, 'James Rodriguez', 'Customer', 'Knowledgeable staff who really care about customer satisfaction. Will definitely return for future purchases.', 5, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face', true, '2025-06-11 23:13:26.081'),
(9, 'Maria Gonzalez', 'Customer', 'Great financing options and helpful staff. Made car buying stress-free and enjoyable.', 4, 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face', true, '2025-06-11 23:13:26.081'),
(10, 'Kevin Brown', 'Customer', 'Honest and upfront about vehicle history. No surprises or hidden issues. Very trustworthy dealership.', 5, 'https://images.unsplash.com/photo-1474176857210-7287d38d27c6?w=150&h=150&fit=crop&crop=face', true, '2025-06-11 23:13:26.081'),
(11, 'Stephanie B.', 'Customer', 'Amazing experience! The team helped me find the perfect car for my family. Professional, friendly, and honest throughout the entire process.', 5, 'https://images.unsplash.com/photo-1494790108755-2616b332faa6?w=100&h=100&fit=crop&crop=face', true, '2025-06-12 06:51:49.146'),
(12, 'Alex Thompson', 'Customer', 'Exceptional service and great selection of vehicles. The staff was knowledgeable and helped me make the right choice.', 4, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', true, '2025-06-12 06:51:49.146'),
(13, 'Maria Rodriguez', 'Customer', 'Trustworthy and reliable dealership. They were transparent about everything and made the buying process smooth and easy.', 5, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', true, '2025-06-12 06:51:49.146');

INSERT INTO admin_credentials (id, username, password_hash, recovery_code, is_active, created_at, updated_at) VALUES
(1, 'admin', 'integrity2024', 'INTEGRITY2024RESET', true, '2025-06-12 07:36:52.687376', '2025-06-12 07:45:41.792');

-- Update sequence values to avoid conflicts
SELECT setval('cars_id_seq', (SELECT MAX(id) FROM cars));
SELECT setval('services_id_seq', (SELECT MAX(id) FROM services));
SELECT setval('testimonials_id_seq', (SELECT MAX(id) FROM testimonials));
SELECT setval('admin_credentials_id_seq', (SELECT MAX(id) FROM admin_credentials));

-- Verify data migration
SELECT 'Cars' as table_name, COUNT(*) as record_count FROM cars
UNION ALL
SELECT 'Services' as table_name, COUNT(*) as record_count FROM services
UNION ALL
SELECT 'Testimonials' as table_name, COUNT(*) as record_count FROM testimonials
UNION ALL
SELECT 'Admin Credentials' as table_name, COUNT(*) as record_count FROM admin_credentials;