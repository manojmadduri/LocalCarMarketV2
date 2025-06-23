-- Complete Supabase Database Setup for Integrity Auto

-- Create admin_credentials table
CREATE TABLE IF NOT EXISTS admin_credentials (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  recovery_code TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create sessions table for admin sessions
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

-- Create cars table
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
  dealer_rating DECIMAL(3,1),
  days_on_market INTEGER,
  vehicle_history TEXT,
  financing_available BOOLEAN DEFAULT true
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
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
CREATE TABLE IF NOT EXISTS testimonials (
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

-- Create contact_messages table
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

-- Insert admin credentials
INSERT INTO admin_credentials (username, password_hash, recovery_code, is_active, created_at, updated_at)
VALUES ('admin', 'admin123', 'INTEGRITY2024RESET', true, NOW(), NOW())
ON CONFLICT (username) DO NOTHING;

-- Insert sample cars data
INSERT INTO cars (make, model, year, price, mileage, color, fuel_type, transmission, condition, status, images, description, vin, features, interior_color, drivetrain, body_style, engine, trim, number_of_seats, number_of_doors, mpg_city, mpg_highway, safety_rating, dealer_rating, days_on_market, vehicle_history, financing_available) VALUES
('Toyota', 'Camry', 2020, 24999.00, 35000, 'Silver', 'Gasoline', 'Automatic', 'used', 'available', ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop&crop=center'], 'Well-maintained Toyota Camry', 'TOY123456789012345', ARRAY['Fuel Efficient', 'Reliability Rating 5/5'], 'Black', 'FWD', 'Sedan', '2.0L 4-Cylinder', 'LE', 5, 4, 28, 39, '5.0', 4.8, 15, 'Clean Title', true),
('Honda', 'Civic', 2019, 19999.00, 42000, 'Blue', 'Gasoline', 'Manual', 'used', 'available', ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&crop=center'], 'Sporty Honda Civic in excellent condition', 'HON123456789012345', ARRAY['Honda Sensing Safety Suite', 'Adaptive Cruise Control'], 'Gray', 'FWD', 'Sedan', '2.0L 4-Cylinder', 'Sport', 5, 4, 31, 40, '5.0', 4.7, 8, 'Clean Title', true),
('Ford', 'F-150', 2021, 32999.00, 25000, 'Black', 'Gasoline', 'Automatic', 'used', 'available', ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center'], 'Powerful Ford F-150 pickup truck', 'FOR123456789012345', ARRAY['F-150 Tough', 'Best-in-Class Towing'], 'Black', '4WD', 'Truck', '3.5L EcoBoost V6', 'XLT', 6, 4, 20, 24, '4.0', 4.9, 22, 'Clean Title', true),
('BMW', 'X3', 2022, 42999.00, 18000, 'White', 'Gasoline', 'Automatic', 'used', 'available', ARRAY['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&crop=center'], 'Luxury BMW X3 with premium features', 'BMW123456789012345', ARRAY['Leather Seats', 'Heated Front Seats'], 'Brown', 'AWD', 'SUV', '3.0L Twin Turbo I6', 'xDrive30i', 5, 4, 23, 29, '5.0', 4.6, 5, 'Clean Title', true),
('Tesla', 'Model 3', 2023, 38999.00, 12000, 'Red', 'Electric', 'Automatic', 'used', 'available', ARRAY['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&crop=center'], 'Latest Tesla Model 3 with Autopilot', 'TES123456789012345', ARRAY['Autopilot', 'Supercharging'], 'White', 'RWD', 'Sedan', 'Electric Motor', 'Standard Range Plus', 5, 4, 130, 120, '5.0', 4.9, 3, 'Clean Title', true),
('Chevrolet', 'Malibu', 2019, 22999.00, 38000, 'Gray', 'Gasoline', 'Automatic', 'used', 'sold', ARRAY['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&crop=center'], 'Reliable Chevrolet Malibu', 'CHE123456789012345', ARRAY['OnStar', 'Apple CarPlay'], 'Gray', 'FWD', 'Sedan', '1.5L Turbo 4-Cylinder', 'LT', 5, 4, 29, 36, '4.0', 4.5, 18, 'Clean Title', true);

-- Insert services data
INSERT INTO services (name, description, starting_price, category, icon, image, features, duration, is_active, image_url) VALUES
('Oil Change', 'Complete oil and filter change service', 49.99, 'Maintenance', 'wrench', 'oil-change.jpg', ARRAY['Synthetic Oil Available', 'Filter Replacement', 'Fluid Level Check'], '30 minutes', true, 'https://images.unsplash.com/photo-1632823469372-6c3a701c4e8e?w=400&h=300&fit=crop'),
('Brake Inspection', 'Comprehensive brake system inspection', 75.00, 'Safety', 'shield', 'brake-inspection.jpg', ARRAY['Brake Pad Check', 'Rotor Inspection', 'Brake Fluid Test'], '45 minutes', true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'),
('Tire Rotation', 'Professional tire rotation and pressure check', 35.00, 'Maintenance', 'rotate-ccw', 'tire-rotation.jpg', ARRAY['Tire Pressure Check', 'Tread Inspection', 'Alignment Check'], '20 minutes', true, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop'),
('Battery Test', 'Battery and charging system diagnostic', 25.00, 'Electrical', 'battery', 'battery-test.jpg', ARRAY['Load Test', 'Charging System Check', 'Terminal Cleaning'], '15 minutes', true, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop'),
('Air Filter Replacement', 'Engine and cabin air filter replacement', 65.00, 'Maintenance', 'wind', 'air-filter.jpg', ARRAY['Engine Air Filter', 'Cabin Air Filter', 'Filter Quality Check'], '25 minutes', true, 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=400&h=300&fit=crop'),
('Transmission Service', 'Complete transmission fluid and filter service', 149.99, 'Drivetrain', 'cog', 'transmission.jpg', ARRAY['Fluid Replacement', 'Filter Change', 'System Inspection'], '60 minutes', true, 'https://images.unsplash.com/photo-1597404294360-feeeda04f042?w=400&h=300&fit=crop'),
('AC Service', 'Air conditioning system service and repair', 89.99, 'Climate', 'snowflake', 'ac-service.jpg', ARRAY['Refrigerant Check', 'Leak Detection', 'System Cleaning'], '45 minutes', true, 'https://images.unsplash.com/photo-1551522435-a13afa10f103?w=400&h=300&fit=crop'),
('Engine Diagnostic', 'Computer diagnostic scan and analysis', 99.99, 'Diagnostic', 'cpu', 'engine-diagnostic.jpg', ARRAY['OBD-II Scan', 'Error Code Analysis', 'Performance Check'], '30 minutes', true, 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400&h=300&fit=crop'),
('Coolant Flush', 'Complete cooling system flush and fill', 79.99, 'Maintenance', 'droplets', 'coolant-flush.jpg', ARRAY['System Flush', 'New Coolant', 'Thermostat Check'], '40 minutes', true, 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&h=300&fit=crop'),
('Wheel Alignment', 'Precision wheel alignment service', 129.99, 'Alignment', 'move', 'wheel-alignment.jpg', ARRAY['4-Wheel Alignment', 'Suspension Check', 'Tire Wear Analysis'], '60 minutes', true, 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop');

-- Insert testimonials data
INSERT INTO testimonials (name, role, rating, comment, image, is_approved, created_at) VALUES
('Sarah Johnson', 'Customer', 5, 'Excellent service! They found exactly what I was looking for and the buying process was smooth and professional.', 'https://images.unsplash.com/photo-1494790108755-2616b332faa6?w=150&h=150&fit=crop&crop=face', true, NOW()),
('Mike Chen', 'Customer', 5, 'Great experience buying my used Honda Civic. The team was honest about the vehicle condition and pricing was fair.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', true, NOW()),
('Jennifer Martinez', 'Customer', 5, 'Outstanding customer service! They went above and beyond to help me find the perfect car within my budget.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', true, NOW()),
('David Wilson', 'Customer', 5, 'Professional and reliable. My Ford F-150 has been running perfectly since purchase. Highly recommended!', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', true, NOW()),
('Lisa Thompson', 'Customer', 4, 'Transparent pricing and honest service. They helped me understand exactly what I was buying.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', true, NOW());
