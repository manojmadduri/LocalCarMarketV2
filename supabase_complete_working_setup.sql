-- Complete Working Supabase Database Setup for Integrity Auto
-- This script creates all tables with the exact column structure your application expects
-- Run this entire script in your Supabase SQL Editor

-- Drop all existing tables in correct order
DROP TABLE IF EXISTS service_bookings CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS cars CASCADE;
DROP TABLE IF EXISTS admin_credentials CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;

-- Cars table (exact match to your Drizzle schema)
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

-- Sessions table
CREATE TABLE sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP NOT NULL
);

-- Create session index
CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);

-- Insert admin user (username: admin, password: integrity2024)
INSERT INTO admin_credentials (username, passwordHash) 
VALUES ('admin', '$2b$10$pZWDhAzXDaKSEy3rc3RIye/WBf31lWUSvkK67Ni7BUog0Z4M2ZEra');

-- Insert cars with BMW vehicles for search testing
INSERT INTO cars (make, model, year, price, mileage, color, condition, fuelType, transmission, drivetrain, bodyStyle, engine, mpgCity, mpgHighway, safetyRating, dealerRating, daysOnMarket, financing, interiorColor, vehicleHistory, features, numberOfSeats, numberOfDoors, images, description, vin) VALUES
('BMW', 'X5', 2021, '$52,900', 28000, 'White', 'Used', 'Gasoline', 'Automatic', 'AWD', 'SUV', '3.0L I6 Turbo', 22, 29, '5', '4.5', 35, 'Available', 'Tan Leather', 'Clean Title', ARRAY['Premium Package', 'Navigation', 'Panoramic Sunroof'], 7, 4, ARRAY['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&crop=center'], 'Luxury SUV with premium features and all-wheel drive capability.', 'WBAJA7C58LC123456'),
('BMW', '3 Series', 2020, '$34,500', 35000, 'Black', 'Used', 'Gasoline', 'Automatic', 'RWD', 'Sedan', '2.0L I4 Turbo', 26, 36, '5', '4.4', 12, 'Available', 'Black Leather', 'Clean Title', ARRAY['Sport Package', 'Premium Audio', 'Heated Seats'], 5, 4, ARRAY['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center'], 'Performance-oriented luxury sedan with sporty handling.', '3MW5R1J09L8123456'),
('BMW', 'X3', 2022, '$42,999', 18000, 'White', 'Used', 'Gasoline', 'Automatic', 'AWD', 'SUV', '3.0L Twin Turbo I6', 23, 29, '5', '4.6', 5, 'Available', 'Brown Leather', 'Clean Title', ARRAY['Leather Seats', 'Heated Front Seats', 'Navigation System'], 5, 4, ARRAY['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center'], 'Luxury BMW X3 with premium features and AWD capability.', 'BMW123456789012345'),
('Toyota', 'Camry', 2022, '$28,500', 15000, 'Silver', 'Used', 'Gasoline', 'Automatic', 'FWD', 'Sedan', '2.5L I4', 28, 39, '5', '4.8', 15, 'Available', 'Black Cloth', 'Clean Title', ARRAY['Backup Camera', 'Bluetooth', 'Lane Keeping Assist'], 5, 4, ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop&crop=center'], 'Reliable and fuel-efficient sedan with modern safety features.', 'JT2BF22K123456789'),
('Honda', 'Civic', 2021, '$24,900', 22000, 'Blue', 'Used', 'Gasoline', 'CVT', 'FWD', 'Sedan', '2.0L I4', 32, 42, '5', '4.7', 8, 'Available', 'Gray Cloth', 'Clean Title', ARRAY['Apple CarPlay', 'Honda Sensing', 'Backup Camera'], 5, 4, ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&crop=center'], 'Sporty and efficient compact car with advanced technology.', 'JHMFB2F23MH123456'),
('Ford', 'F-150', 2023, '$45,999', 8500, 'Black', 'Used', 'Gasoline', 'Automatic', '4WD', 'Pickup', '5.0L V8', 20, 26, '4', '4.6', 22, 'Available', 'Black Leather', 'Clean Title', ARRAY['Towing Package', '4WD', 'Crew Cab'], 5, 4, ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center'], 'Powerful full-size pickup truck perfect for work and recreation.', '1FTFW1E84NFA12345'),
('Tesla', 'Model 3', 2023, '$38,999', 12000, 'Red', 'Used', 'Electric', 'Automatic', 'RWD', 'Sedan', 'Electric Motor', 130, 120, '5', '4.9', 3, 'Available', 'White Interior', 'Clean Title', ARRAY['Autopilot', 'Supercharging', 'Premium Interior'], 5, 4, ARRAY['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&crop=center'], 'Latest Tesla Model 3 with Autopilot and premium features.', 'TES123456789012345'),
('Chevrolet', 'Malibu', 2019, '$22,999', 38000, 'Gray', 'Used', 'Gasoline', 'Automatic', 'FWD', 'Sedan', '1.5L Turbo 4-Cylinder', 29, 36, '4', '4.5', 18, 'Available', 'Gray Cloth', 'Clean Title', ARRAY['OnStar', 'Apple CarPlay', 'Android Auto'], 5, 4, ARRAY['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&crop=center'], 'Reliable Chevrolet Malibu with great fuel economy.', 'CHE123456789012345');

-- Insert services
INSERT INTO services (name, description, price, duration, category, features, popular) VALUES
('Oil Change Service', 'Complete oil change with filter replacement and multi-point inspection', '$49.99', '30 minutes', 'Maintenance', ARRAY['Synthetic Oil Options', 'Filter Replacement', 'Fluid Top-off'], true),
('Brake Inspection & Repair', 'Comprehensive brake system inspection and repair services', '$149.99', '2 hours', 'Safety', ARRAY['Brake Pad Replacement', 'Rotor Resurfacing', 'Brake Fluid Change'], true),
('Engine Diagnostic', 'Advanced computer diagnostic to identify engine issues', '$99.99', '1 hour', 'Diagnostic', ARRAY['OBD-II Scan', 'Error Code Analysis', 'Repair Recommendations'], false),
('Tire Rotation', 'Professional tire rotation and pressure check', '$35.00', '20 minutes', 'Maintenance', ARRAY['Tire Pressure Check', 'Tread Inspection', 'Alignment Check'], false),
('Battery Test', 'Battery and charging system diagnostic', '$25.00', '15 minutes', 'Electrical', ARRAY['Load Test', 'Charging System Check', 'Terminal Cleaning'], false),
('Air Filter Replacement', 'Engine and cabin air filter replacement', '$65.00', '25 minutes', 'Maintenance', ARRAY['Engine Air Filter', 'Cabin Air Filter', 'Filter Quality Check'], false),
('Transmission Service', 'Complete transmission fluid and filter service', '$149.99', '60 minutes', 'Drivetrain', ARRAY['Fluid Replacement', 'Filter Change', 'System Inspection'], false),
('AC Service', 'Air conditioning system service and repair', '$89.99', '45 minutes', 'Climate', ARRAY['Refrigerant Check', 'Leak Detection', 'System Cleaning'], false),
('Coolant Flush', 'Complete cooling system flush and fill', '$79.99', '40 minutes', 'Maintenance', ARRAY['System Flush', 'New Coolant', 'Thermostat Check'], false),
('Wheel Alignment', 'Precision wheel alignment service', '$129.99', '60 minutes', 'Alignment', ARRAY['4-Wheel Alignment', 'Suspension Check', 'Tire Wear Analysis'], false);

-- Insert testimonials
INSERT INTO testimonials (name, role, content, rating, avatar, date, approved) VALUES
('Sarah Johnson', 'Verified Buyer', 'Excellent service and great selection of vehicles. The staff was very helpful throughout the entire process.', 5, 'https://images.unsplash.com/photo-1494790108755-2616b332faa6?w=150&h=150&fit=crop&crop=face', '2024-01-15', true),
('Mike Rodriguez', 'Service Customer', 'Fast and reliable auto repair services. They fixed my brake issue quickly and at a fair price.', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', '2024-01-10', true),
('Jennifer Davis', 'Verified Buyer', 'Found the perfect car for my family. Great financing options and transparent pricing.', 4, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', '2024-01-05', true),
('David Wilson', 'Verified Buyer', 'Professional and reliable. My Ford F-150 has been running perfectly since purchase. Highly recommended!', 5, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', '2023-12-20', true),
('Lisa Thompson', 'Service Customer', 'Transparent pricing and honest service. They helped me understand exactly what I was buying.', 4, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', '2023-12-15', true),
('Robert Garcia', 'Verified Buyer', 'Fast and efficient service department. My BMW X3 maintenance was completed on time and within budget.', 5, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', '2023-12-10', true),
('Amanda Lee', 'Verified Buyer', 'Excellent selection of quality used vehicles. Found my dream car at a great price!', 5, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face', '2023-12-05', true),
('James Rodriguez', 'Service Customer', 'Knowledgeable staff who really care about customer satisfaction. Will definitely return for future purchases.', 5, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face', '2023-11-30', true);

-- Final verification
SELECT 'Database Setup Complete!' as status, 
       (SELECT COUNT(*) FROM cars) as cars_count,
       (SELECT COUNT(*) FROM services) as services_count,
       (SELECT COUNT(*) FROM testimonials) as testimonials_count,
       (SELECT COUNT(*) FROM admin_credentials) as admin_count,
       (SELECT COUNT(*) FROM contact_messages) as contact_messages_count;