/*
  # Create customers table

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `customer_name` (text, required)
      - `unique_id` (text, unique, required)
      - `tracking_number` (text, required)
      - `status` (text, default 'active')
      - `notes` (text, optional)
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)
      - `created_by` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on `customers` table
    - Add policies for authenticated users to manage customers

  3. Performance
    - Add indexes on frequently queried columns
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  unique_id text NOT NULL,
  tracking_number text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid NOT NULL REFERENCES auth.users(id)
);

-- Add unique constraint on unique_id if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'customers_unique_id_key' 
    AND table_name = 'customers'
  ) THEN
    ALTER TABLE customers ADD CONSTRAINT customers_unique_id_key UNIQUE (unique_id);
  END IF;
END $$;

-- Add status constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'customers_status_check' 
    AND table_name = 'customers'
  ) THEN
    ALTER TABLE customers ADD CONSTRAINT customers_status_check 
      CHECK (status = ANY (ARRAY['active'::text, 'completed'::text, 'pending'::text, 'cancelled'::text]));
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_created_by ON customers USING btree (created_by);
CREATE INDEX IF NOT EXISTS idx_customers_customer_name ON customers USING btree (customer_name);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers USING btree (status);
CREATE INDEX IF NOT EXISTS idx_customers_tracking_number ON customers USING btree (tracking_number);
CREATE INDEX IF NOT EXISTS idx_customers_unique_id ON customers USING btree (unique_id);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create or replace the update function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at timestamp
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Authenticated users can create customers" ON customers;
DROP POLICY IF EXISTS "Authenticated users can read all customers" ON customers;
DROP POLICY IF EXISTS "Authenticated users can update customers" ON customers;
DROP POLICY IF EXISTS "Authenticated users can delete customers" ON customers;

-- Create RLS policies
CREATE POLICY "Authenticated users can create customers"
  ON customers
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Authenticated users can read all customers"
  ON customers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update customers"
  ON customers
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete customers"
  ON customers
  FOR DELETE
  TO authenticated
  USING (true);