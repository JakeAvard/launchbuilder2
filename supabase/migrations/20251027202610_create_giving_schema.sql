/*
  # GiveTrack Database Schema

  ## Overview
  This migration creates the core schema for the GiveTrack giving/donation tracking application.

  ## New Tables

  ### `organizations`
  Stores nonprofit organizations that users can support
  - `id` (uuid, primary key)
  - `name` (text) - Organization name
  - `category` (text) - Type of organization (Education, Environment, etc.)
  - `mission` (text) - Mission statement
  - `rating` (numeric) - Average rating (0-5)
  - `impact_metric` (text) - Description of impact
  - `location` (text) - Geographic location
  - `created_at` (timestamptz) - Creation timestamp

  ### `donations`
  Tracks individual donation transactions
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Reference to auth.users
  - `organization_id` (uuid) - Reference to organizations
  - `amount` (numeric) - Donation amount
  - `is_recurring` (boolean) - Whether this is a recurring donation
  - `donation_date` (timestamptz) - Date of donation
  - `created_at` (timestamptz) - Creation timestamp

  ### `campaigns`
  Tracks giving campaigns with goals
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Reference to auth.users
  - `title` (text) - Campaign name
  - `goal_amount` (numeric) - Target amount
  - `raised_amount` (numeric) - Current amount raised
  - `is_recurring` (boolean) - Whether this is recurring
  - `created_at` (timestamptz) - Creation timestamp

  ### `user_settings`
  Stores user preferences and goals
  - `user_id` (uuid, primary key) - Reference to auth.users
  - `monthly_goal` (numeric) - Monthly giving goal
  - `email_notifications` (boolean) - Email notification preference
  - `monthly_summary` (boolean) - Monthly summary preference
  - `org_recommendations` (boolean) - Organization recommendation preference
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Organizations table is publicly readable
  - Authenticated users required for all write operations

  ## Important Notes
  1. All monetary amounts stored as numeric for precision
  2. Timestamps use timestamptz for timezone support
  3. Foreign key constraints ensure data integrity
  4. Indexes added for common query patterns
*/

CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  mission text DEFAULT '',
  rating numeric(2,1) DEFAULT 0,
  impact_metric text DEFAULT '',
  location text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  is_recurring boolean DEFAULT false,
  donation_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  goal_amount numeric(10,2) NOT NULL,
  raised_amount numeric(10,2) DEFAULT 0,
  is_recurring boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  monthly_goal numeric(10,2) DEFAULT 0,
  email_notifications boolean DEFAULT true,
  monthly_summary boolean DEFAULT true,
  org_recommendations boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organizations are viewable by everyone"
  ON organizations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can view their own donations"
  ON donations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own donations"
  ON donations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own donations"
  ON donations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own donations"
  ON donations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own campaigns"
  ON campaigns FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own campaigns"
  ON campaigns FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns"
  ON campaigns FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns"
  ON campaigns FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_donations_user_id ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_org_id ON donations(organization_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_organizations_category ON organizations(category);
