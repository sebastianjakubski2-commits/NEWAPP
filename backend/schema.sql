-- Create ENUM for card type
CREATE TYPE card_type AS ENUM ('standard', 'cloze');

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  avatar_url TEXT
);

-- Create decks table
CREATE TABLE decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  cover_url TEXT
);

-- Create cards table
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID REFERENCES decks(id) ON DELETE CASCADE,
  type card_type DEFAULT 'standard',
  content_front TEXT NOT NULL,
  content_back TEXT NOT NULL,
  hint TEXT
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  next_review TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  interval INTEGER DEFAULT 0,
  ease_factor FLOAT DEFAULT 2.5,
  repetition_count INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
-- Private for user (CRUD only for owner)
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can delete their own profile" ON profiles FOR DELETE TO authenticated USING (auth.uid() = id);

-- Policies for decks
-- Public read (for logged in)
CREATE POLICY "Logged in users can view decks" ON decks FOR SELECT TO authenticated USING (true);

-- Policies for cards
-- Public read (for logged in)
CREATE POLICY "Logged in users can view cards" ON cards FOR SELECT TO authenticated USING (true);

-- Policies for reviews
-- Private for user (CRUD only for owner)
CREATE POLICY "Users can view their own reviews" ON reviews FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own reviews" ON reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);
