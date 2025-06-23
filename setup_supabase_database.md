# Direct Supabase Database Setup

## Step 1: Execute This SQL Script in Your Supabase SQL Editor

Copy and paste this complete script into your Supabase SQL Editor and run it:

```sql
-- Complete Database Setup for Integrity Auto

-- Drop existing tables if they exist (to ensure clean setup)
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS service_bookings CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS cars CASCADE;
DROP TABLE IF EXISTS admin_credentials CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;

-- Create admin_credentials table
CREATE TABLE admin_credentials (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  recovery_code TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

-- Create cars table
CREATE TABLE cars (
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
  dealer_rating DECIMAL(3,1),
  days_on_market INTEGER,
  vehicle_history TEXT,
  financing_available BOOLEAN DEFAULT true
);

-- Create services table
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  starting_price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  image TEXT,
  features TEXT[] DEFAULT '{}',
  duration TEXT,
  is_active BOOLEAN DEFAULT true,
  image_url TEXT
);

-- Create testimonials table
CREATE TABLE testimonials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  image TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create service_bookings table
CREATE TABLE service_bookings (
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

-- Create contact_messages table
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert admin credentials
INSERT INTO admin_credentials (username, password_hash, recovery_code, is_active, created_at, updated_at)
VALUES ('admin', 'admin123', 'INTEGRITY2024RESET', true, NOW(), NOW());

-- Insert sample cars data
INSERT INTO cars (make, model, year, price, mileage, color, fuel_type, transmission, condition, status, images, description, vin, features, interior_color, drivetrain, body_style, engine, trim, number_of_seats, number_of_doors, mpg_city, mpg_highway, safety_rating, dealer_rating, days_on_market, vehicle_history, financing_available) VALUES
('Toyota', 'Camry', 2020, 24999.00, 35000, 'Silver', 'Gasoline', 'Automatic', 'used', 'available', ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop&crop=center'], 'Well-maintained Toyota Camry with excellent reliability record', 'TOY123456789012345', ARRAY['Toyota Safety Sense', 'Fuel Efficient Engine', 'Premium Audio System'], 'Black', 'FWD', 'Sedan', '2.5L 4-Cylinder', 'LE', 5, 4, 28, 39, '5.0', 4.8, 15, 'Clean Title', true),
('Honda', 'Civic', 2019, 19999.00, 42000, 'Blue', 'Gasoline', 'Manual', 'used', 'available', ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&crop=center'], 'Sporty Honda Civic with manual transmission', 'HON123456789012345', ARRAY['Honda Sensing Safety Suite', 'Sport Mode', 'Manual Transmission'], 'Gray', 'FWD', 'Sedan', '2.0L 4-Cylinder', 'Sport', 5, 4, 31, 40, '5.0', 4.7, 8, 'Clean Title', true),
('Ford', 'F-150', 2021, 32999.00, 25000, 'Black', 'Gasoline', 'Automatic', 'used', 'available', ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center'], 'Powerful Ford F-150 pickup truck with towing package', 'FOR123456789012345', ARRAY['Towing Package', 'Crew Cab', 'Bedliner'], 'Black', '4WD', 'Truck', '3.5L EcoBoost V6', 'XLT', 6, 4, 20, 24, '4.0', 4.9, 22, 'Clean Title', true),
('BMW', 'X3', 2022, 42999.00, 18000, 'White', 'Gasoline', 'Automatic', 'used', 'available', ARRAY['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&crop=center'], 'Luxury BMW X3 with premium features and low miles', 'BMW123456789012345', ARRAY['Luxury Package', 'Heated Seats', 'Navigation System'], 'Brown', 'AWD', 'SUV', '3.0L Twin Turbo I6', 'xDrive30i', 5, 4, 23, 29, '5.0', 4.6, 5, 'Clean Title', true),
('Tesla', 'Model 3', 2023, 38999.00, 12000, 'Red', 'Electric', 'Automatic', 'used', 'available', ARRAY['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&crop=center'], 'Latest Tesla Model 3 with Full Self-Driving capability', 'TES123456789012345', ARRAY['Autopilot', 'Supercharging Network', 'Over-the-Air Updates'], 'White', 'RWD', 'Sedan', 'Electric Motor', 'Standard Range Plus', 5, 4, 130, 120, '5.0', 4.9, 3, 'Clean Title', true);

-- Insert services data
INSERT INTO services (name, description, starting_price, category, icon, image, features, duration, is_active, image_url) VALUES
('Oil Change Service', 'Complete oil and filter change with multi-point inspection', 49.99, 'Maintenance', 'wrench', 'oil-change.jpg', ARRAY['Synthetic Oil Available', 'Filter Replacement', 'Fluid Level Check', 'Battery Test'], '30 minutes', true, 'https://images.unsplash.com/photo-1632823469372-6c3a701c4e8e?w=400&h=300&fit=crop'),
('Brake System Inspection', 'Comprehensive brake system inspection and service', 75.00, 'Safety', 'shield', 'brake-service.jpg', ARRAY['Brake Pad Inspection', 'Rotor Analysis', 'Brake Fluid Test', 'ABS System Check'], '45 minutes', true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'),
('Tire Services', 'Professional tire rotation, balancing, and alignment', 85.00, 'Maintenance', 'rotate-ccw', 'tire-service.jpg', ARRAY['Tire Rotation', 'Wheel Balancing', 'Pressure Check', 'Tread Analysis'], '60 minutes', true, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop'),
('Battery & Electrical', 'Battery and charging system diagnostic and service', 65.00, 'Electrical', 'battery', 'electrical-service.jpg', ARRAY['Battery Load Test', 'Alternator Check', 'Starter Test', 'Electrical System Scan'], '45 minutes', true, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop'),
('Engine Diagnostics', 'Advanced computer diagnostic scan and analysis', 99.99, 'Diagnostic', 'cpu', 'engine-diagnostic.jpg', ARRAY['OBD-II Scan', 'Error Code Analysis', 'Performance Check', 'Emissions Test'], '30 minutes', true, 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400&h=300&fit=crop'),
('Transmission Service', 'Complete transmission fluid and filter service', 149.99, 'Drivetrain', 'cog', 'transmission-service.jpg', ARRAY['Fluid Replacement', 'Filter Change', 'System Inspection', 'Road Test'], '90 minutes', true, 'https://images.unsplash.com/photo-1597404294360-feeeda04f042?w=400&h=300&fit=crop'),
('AC & Climate Control', 'Air conditioning system service and repair', 89.99, 'Climate', 'snowflake', 'ac-service.jpg', ARRAY['Refrigerant Check', 'Leak Detection', 'System Cleaning', 'Performance Test'], '60 minutes', true, 'https://images.unsplash.com/photo-1551522435-a13afa10f103?w=400&h=300&fit=crop'),
('Cooling System Service', 'Complete cooling system flush and maintenance', 79.99, 'Maintenance', 'droplets', 'cooling-service.jpg', ARRAY['Coolant Flush', 'Thermostat Check', 'Radiator Inspection', 'Hose Inspection'], '75 minutes', true, 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&h=300&fit=crop');

-- Insert testimonials data
INSERT INTO testimonials (name, role, rating, comment, image, is_approved, created_at) VALUES
('Sarah Johnson', 'Verified Customer', 5, 'Outstanding service! The team at Integrity Auto found exactly what I was looking for. The buying process was smooth, transparent, and professional from start to finish.', 'https://images.unsplash.com/photo-1494790108755-2616b332faa6?w=150&h=150&fit=crop&crop=face', true, NOW()),
('Michael Chen', 'Verified Customer', 5, 'Excellent experience purchasing my Honda Civic. The staff was honest about the vehicle condition, pricing was fair, and they even threw in a free oil change!', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', true, NOW()),
('Jennifer Martinez', 'Verified Customer', 5, 'Incredible customer service! They went above and beyond to help me find the perfect car within my budget. Highly recommended for anyone looking for quality used vehicles.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', true, NOW()),
('David Wilson', 'Verified Customer', 5, 'Professional and reliable dealership. My Ford F-150 has been running perfectly since purchase. Their service department is top-notch too!', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', true, NOW()),
('Lisa Thompson', 'Verified Customer', 4, 'Great experience overall. Transparent pricing, honest service, and they really took the time to explain everything about the vehicle I was purchasing.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', true, NOW()),
('Robert Garcia', 'Verified Customer', 5, 'Fast and efficient service department. My BMW maintenance was completed on time and within budget. Will definitely be returning for future service needs.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', true, NOW());

-- Verify the setup
SELECT 'Setup Complete!' as status;
SELECT 'Cars: ' || COUNT(*) as count FROM cars;
SELECT 'Services: ' || COUNT(*) as count FROM services;
SELECT 'Testimonials: ' || COUNT(*) as count FROM testimonials;
SELECT 'Admin Users: ' || COUNT(*) as count FROM admin_credentials;
```

## Step 2: Verification Queries

After running the setup script, verify everything is working by running these queries:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Check admin credentials
SELECT username, is_active FROM admin_credentials;

-- Check sample data
SELECT make, model, year, price FROM cars LIMIT 3;
SELECT name, starting_price FROM services LIMIT 3;
SELECT name, rating FROM testimonials LIMIT 3;
```

## Step 3: Admin Login Details

Once the database is set up, you can log into your admin panel at `/admin` with:
- **Username:** admin
- **Password:** admin123

All changes made through the admin panel will now be stored directly in your Supabase database.