/*
  # Create customers table

  1. New Tables
    - `customers`
      - `id` (uuid, primary key, auto-generated)
      - `customer_name` (text, required)
      - `unique_id` (text, required, unique)
      - `tracking_number` (text, required)
      - `status` (text, default 'active', constrained to specific values)
      - `notes` (text, optional)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
      - `created_by` (uuid, required, references users.id)

  2. Security
    - Enable RLS on `customers` table
    - Add policies for authenticated users to perform CRUD operations
    - Users can create customers (with created_by = their user id)
    - Users can read, update, and delete all customers

  3. Indexes
    - Primary key on id
    - Unique index on unique_id
    - Indexes on frequently queried columns for performance

  4. Triggers
    - Auto-update updated_at timestamp on row updates
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  unique_id text NOT NULL UNIQUE,
  tracking_number text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid NOT NULL REFERENCES auth.users(id)
);

-- Add status constraint
ALTER TABLE customers ADD CONSTRAINT customers_status_check 
  CHECK (status = ANY (ARRAY['active'::text, 'completed'::text, 'pending'::text, 'cancelled'::text]));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_created_by ON customers USING btree (created_by);
CREATE INDEX IF NOT EXISTS idx_customers_customer_name ON customers USING btree (customer_name);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers USING btree (status);
CREATE INDEX IF NOT EXISTS idx_customers_tracking_number ON customers USING btree (tracking_number);
CREATE INDEX IF NOT EXISTS idx_customers_unique_id ON customers USING btree (unique_id);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

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

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();