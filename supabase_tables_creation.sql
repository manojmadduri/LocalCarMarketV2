-- Complete table creation script for Supabase database
-- Run this in your Supabase SQL editor

-- Cars table
CREATE TABLE cars (
  id SERIAL PRIMARY KEY,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price TEXT NOT NULL,
  mileage INTEGER NOT NULL,
  color TEXT NOT NULL,
  condition TEXT NOT NULL,
  fuelType TEXT NOT NULL,
  transmission TEXT NOT NULL,
  drivetrain TEXT,
  bodyStyle TEXT,
  engine TEXT,
  mpgCity INTEGER,
  mpgHighway INTEGER,
  safetyRating TEXT,
  dealerRating TEXT,
  daysOnMarket INTEGER,
  financing TEXT,
  interiorColor TEXT,
  vehicleHistory TEXT,
  features TEXT[],
  numberOfSeats INTEGER,
  numberOfDoors INTEGER,
  images TEXT[],
  description TEXT,
  status TEXT NOT NULL DEFAULT 'available',
  vin TEXT UNIQUE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT NOT NULL,
  duration TEXT NOT NULL,
  category TEXT NOT NULL,
  features TEXT[],
  popular BOOLEAN DEFAULT false,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE testimonials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL,
  avatar TEXT,
  date TEXT,
  approved BOOLEAN DEFAULT false,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service bookings table
CREATE TABLE service_bookings (
  id SERIAL PRIMARY KEY,
  serviceId INTEGER REFERENCES services(id) ON DELETE CASCADE,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferredDate TEXT NOT NULL,
  preferredTime TEXT NOT NULL,
  vehicleYear TEXT,
  vehicleMake TEXT,
  vehicleModel TEXT,
  additionalNotes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  interest TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin credentials table
CREATE TABLE admin_credentials (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table (for admin authentication)
CREATE TABLE sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP NOT NULL
);

-- Create index on sessions expire column
CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);

-- Insert default admin user (username: admin, password: integrity2024)
INSERT INTO admin_credentials (username, passwordHash) 
VALUES ('admin', '$2b$10$8K1p7mJvKzP4Zg9Yh6CpTeLr0iVN3XdUfE9kQ2SbA7WmHjC5Dg1nO');

-- Insert sample data for testing

-- Sample cars
INSERT INTO cars (make, model, year, price, mileage, color, condition, fuelType, transmission, drivetrain, bodyStyle, engine, mpgCity, mpgHighway, safetyRating, dealerRating, daysOnMarket, financing, interiorColor, vehicleHistory, features, numberOfSeats, numberOfDoors, images, description, vin) VALUES
('Toyota', 'Camry', 2022, '$28,500', 15000, 'Silver', 'Used', 'Gasoline', 'Automatic', 'FWD', 'Sedan', '2.5L I4', 28, 39, '5', '4.8', 15, 'Available', 'Black Cloth', 'Clean Title', ARRAY['Backup Camera', 'Bluetooth', 'Lane Keeping Assist'], 5, 4, ARRAY['/api/placeholder/400/300'], 'Reliable and fuel-efficient sedan with modern safety features.', 'JT2BF22K123456789'),
('Honda', 'Civic', 2021, '$24,900', 22000, 'Blue', 'Used', 'Gasoline', 'CVT', 'FWD', 'Sedan', '2.0L I4', 32, 42, '5', '4.7', 8, 'Available', 'Gray Cloth', 'Clean Title', ARRAY['Apple CarPlay', 'Honda Sensing', 'Backup Camera'], 5, 4, ARRAY['/api/placeholder/400/300'], 'Sporty and efficient compact car with advanced technology.', 'JHMFB2F23MH123456'),
('Ford', 'F-150', 2023, '$45,999', 8500, 'Black', 'Used', 'Gasoline', 'Automatic', '4WD', 'Pickup', '5.0L V8', 20, 26, '4', '4.6', 22, 'Available', 'Black Leather', 'Clean Title', ARRAY['Towing Package', '4WD', 'Crew Cab'], 5, 4, ARRAY['/api/placeholder/400/300'], 'Powerful full-size pickup truck perfect for work and recreation.', '1FTFW1E84NFA12345');

-- Sample services
INSERT INTO services (name, description, price, duration, category, features, popular) VALUES
('Oil Change Service', 'Complete oil change with filter replacement and multi-point inspection', '$49.99', '30 minutes', 'Maintenance', ARRAY['Synthetic Oil Options', 'Filter Replacement', 'Fluid Top-off'], true),
('Brake Inspection & Repair', 'Comprehensive brake system inspection and repair services', '$149.99', '2 hours', 'Safety', ARRAY['Brake Pad Replacement', 'Rotor Resurfacing', 'Brake Fluid Change'], true),
('Engine Diagnostic', 'Advanced computer diagnostic to identify engine issues', '$99.99', '1 hour', 'Diagnostic', ARRAY['OBD-II Scan', 'Error Code Analysis', 'Repair Recommendations'], false);

-- Sample testimonials
INSERT INTO testimonials (name, role, content, rating, avatar, date, approved) VALUES
('Sarah Johnson', 'Verified Buyer', 'Excellent service and great selection of vehicles. The staff was very helpful throughout the entire process.', 5, '/api/placeholder/100/100', '2024-01-15', true),
('Mike Rodriguez', 'Service Customer', 'Fast and reliable auto repair services. They fixed my brake issue quickly and at a fair price.', 5, '/api/placeholder/100/100', '2024-01-10', true),
('Jennifer Davis', 'Verified Buyer', 'Found the perfect car for my family. Great financing options and transparent pricing.', 4, '/api/placeholder/100/100', '2024-01-05', true);