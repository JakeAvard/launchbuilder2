/*
  # Donation Tracking App Schema

  ## Overview
  This migration creates the complete database schema for a donation tracking application
  with support for organizations, campaigns, donations, goals, alerts, and round-up functionality.

  ## New Tables

  ### 1. `organizations`
  - `id` (uuid, primary key)
  - `name` (text) - Organization name
  - `category` (text) - Category (e.g., 'education', 'health', 'environment')
  - `description` (text) - Organization description
  - `logo_url` (text) - Logo image URL
  - `location` (text) - Geographic location
  - `website` (text) - Organization website
  - `verified` (boolean) - Verification status
  - `created_at` (timestamptz)

  ### 2. `campaigns`
  - `id` (uuid, primary key)
  - `organization_id` (uuid, foreign key)
  - `title` (text) - Campaign title
  - `description` (text) - Campaign description
  - `goal_amount` (decimal) - Fundraising goal
  - `current_amount` (decimal) - Current amount raised
  - `start_date` (date) - Campaign start date
  - `end_date` (date) - Campaign end date
  - `image_url` (text) - Campaign image
  - `created_at` (timestamptz)

  ### 3. `user_profiles`
  - `id` (uuid, primary key, references auth.users)
  - `display_name` (text) - User display name
  - `email` (text) - User email
  - `location` (text) - User location for nearby recommendations
  - `monthly_goal` (decimal) - Monthly giving goal
  - `annual_goal` (decimal) - Annual giving goal
  - `round_up_enabled` (boolean) - Round-up feature toggle
  - `round_up_multiplier` (decimal) - Round-up multiplier (1x, 2x, etc.)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. `donations`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `organization_id` (uuid, foreign key)
  - `campaign_id` (uuid, foreign key, nullable)
  - `amount` (decimal) - Donation amount
  - `original_amount` (decimal) - Original amount before round-up
  - `round_up_amount` (decimal) - Round-up amount added
  - `is_recurring` (boolean) - Recurring donation flag
  - `frequency` (text) - 'monthly', 'weekly', 'yearly'
  - `status` (text) - 'completed', 'pending', 'failed'
  - `donation_date` (timestamptz)
  - `created_at` (timestamptz)

  ### 5. `user_organizations`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `organization_id` (uuid, foreign key)
  - `is_favorite` (boolean) - Favorite status
  - `first_donation_date` (timestamptz)
  - `total_donated` (decimal) - Total amount donated
  - `donation_count` (integer) - Number of donations
  - `created_at` (timestamptz)

  ### 6. `alerts`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `type` (text) - 'milestone', 'goal', 'recommendation', 'recurring'
  - `title` (text) - Alert title
  - `message` (text) - Alert message
  - `is_read` (boolean) - Read status
  - `related_id` (uuid, nullable) - Related entity ID
  - `created_at` (timestamptz)

  ### 7. `round_up_settings`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `enabled` (boolean) - Feature enabled
  - `round_to` (decimal) - Round to nearest (e.g., 1.00, 5.00)
  - `auto_donate` (boolean) - Auto-donate round-up amount
  - `accumulation_threshold` (decimal) - Threshold for accumulated round-ups
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Public read access for organizations and campaigns
*/

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  logo_url text,
  location text,
  website text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  goal_amount decimal(12,2) DEFAULT 0,
  current_amount decimal(12,2) DEFAULT 0,
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  email text,
  location text,
  monthly_goal decimal(12,2) DEFAULT 0,
  annual_goal decimal(12,2) DEFAULT 0,
  round_up_enabled boolean DEFAULT false,
  round_up_multiplier decimal(3,1) DEFAULT 1.0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  campaign_id uuid REFERENCES campaigns(id) ON DELETE SET NULL,
  amount decimal(12,2) NOT NULL,
  original_amount decimal(12,2),
  round_up_amount decimal(12,2) DEFAULT 0,
  is_recurring boolean DEFAULT false,
  frequency text DEFAULT 'one-time',
  status text DEFAULT 'completed',
  donation_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create user_organizations table
CREATE TABLE IF NOT EXISTS user_organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  is_favorite boolean DEFAULT false,
  first_donation_date timestamptz DEFAULT now(),
  total_donated decimal(12,2) DEFAULT 0,
  donation_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, organization_id)
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  related_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Create round_up_settings table
CREATE TABLE IF NOT EXISTS round_up_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  enabled boolean DEFAULT true,
  round_to decimal(6,2) DEFAULT 1.00,
  auto_donate boolean DEFAULT false,
  accumulation_threshold decimal(12,2) DEFAULT 10.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE round_up_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations (public read)
CREATE POLICY "Organizations are viewable by everyone"
  ON organizations FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for campaigns (public read)
CREATE POLICY "Campaigns are viewable by everyone"
  ON campaigns FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for donations
CREATE POLICY "Users can view own donations"
  ON donations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own donations"
  ON donations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own donations"
  ON donations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own donations"
  ON donations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for user_organizations
CREATE POLICY "Users can view own organization relationships"
  ON user_organizations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own organization relationships"
  ON user_organizations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own organization relationships"
  ON user_organizations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own organization relationships"
  ON user_organizations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for alerts
CREATE POLICY "Users can view own alerts"
  ON alerts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alerts"
  ON alerts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
  ON alerts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts"
  ON alerts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for round_up_settings
CREATE POLICY "Users can view own round-up settings"
  ON round_up_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own round-up settings"
  ON round_up_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own round-up settings"
  ON round_up_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own round-up settings"
  ON round_up_settings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_organization_id ON donations(organization_id);
CREATE INDEX IF NOT EXISTS idx_donations_date ON donations(donation_date);
CREATE INDEX IF NOT EXISTS idx_campaigns_organization_id ON campaigns(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_organizations_user_id ON user_organizations(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_organizations_category ON organizations(category);