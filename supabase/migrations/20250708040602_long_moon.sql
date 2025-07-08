/*
  # Fix infinite recursion in projects RLS policy

  1. Security Changes
    - Drop the existing recursive policy for projects SELECT
    - Create a simpler policy that only checks project ownership
    - The tasks table already has proper policies to handle task-based access

  2. Notes
    - This removes the circular dependency between projects and tasks policies
    - Users will still be able to access tasks through the tasks table policies
    - Project owners maintain full access to their projects
*/

-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Users can read projects they own or are assigned to" ON projects;

-- Create a simpler policy that only checks ownership
CREATE POLICY "Users can read their own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());