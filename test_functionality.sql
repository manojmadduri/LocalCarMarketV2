-- Quick verification queries to test your Supabase setup
-- Run these after the main table creation script

-- Check if contact_messages table exists with correct structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'contact_messages' 
ORDER BY ordinal_position;

-- Check if BMW cars were inserted correctly
SELECT make, model, year, price 
FROM cars 
WHERE make = 'BMW';

-- Verify total car count
SELECT COUNT(*) as total_cars FROM cars;

-- Test contact message insertion
INSERT INTO contact_messages (firstName, lastName, email, phone, interest, message) 
VALUES ('Test', 'User', 'test@example.com', '555-1234', 'buying-a-car', 'Test message from SQL');

-- Verify contact message was inserted
SELECT * FROM contact_messages WHERE email = 'test@example.com';