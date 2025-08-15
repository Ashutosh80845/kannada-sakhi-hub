-- Create user profiles table with auto-creation trigger
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  xp_points BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Function to create a profile for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create scenarios table
CREATE TABLE public.scenarios (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location_context TEXT,
  cultural_briefing TEXT,
  audio_ambience_url TEXT,
  unlock_message TEXT DEFAULT '🎉 Ready for practice!',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on scenarios (public read access)
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Scenarios are viewable by everyone" 
ON public.scenarios 
FOR SELECT 
USING (true);

-- Create words table
CREATE TABLE public.words (
  id TEXT PRIMARY KEY,
  kannada_script TEXT NOT NULL,
  english_translation TEXT NOT NULL,
  roman_pronunciation TEXT NOT NULL,
  audio_url TEXT,
  image_mnemonic_url TEXT,
  cultural_context TEXT,
  memory_association TEXT,
  similar_hindi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on words (public read access)
ALTER TABLE public.words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Words are viewable by everyone" 
ON public.words 
FOR SELECT 
USING (true);

-- Create scenario_words junction table
CREATE TABLE public.scenario_words (
  id SERIAL PRIMARY KEY,
  scenario_id INTEGER NOT NULL REFERENCES public.scenarios(id) ON DELETE CASCADE,
  word_id TEXT NOT NULL REFERENCES public.words(id) ON DELETE CASCADE,
  learning_priority INTEGER NOT NULL,
  frequency_in_scenario TEXT,
  UNIQUE(scenario_id, word_id)
);

-- Enable RLS on scenario_words (public read access)
ALTER TABLE public.scenario_words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Scenario words are viewable by everyone" 
ON public.scenario_words 
FOR SELECT 
USING (true);

-- Create user_word_progress table
CREATE TABLE public.user_word_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  word_id TEXT NOT NULL REFERENCES public.words(id) ON DELETE CASCADE,
  mastery_level INTEGER NOT NULL DEFAULT 0,
  last_reviewed_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  times_correct INTEGER DEFAULT 0,
  times_incorrect INTEGER DEFAULT 0,
  pronunciation_score INTEGER DEFAULT 0,
  UNIQUE(user_id, word_id)
);

-- Enable RLS on user_word_progress
ALTER TABLE public.user_word_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own word progress" 
ON public.user_word_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own word progress" 
ON public.user_word_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own word progress" 
ON public.user_word_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create user_scenario_progress table
CREATE TABLE public.user_scenario_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scenario_id INTEGER NOT NULL REFERENCES public.scenarios(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'locked',
  highest_score INTEGER DEFAULT 0,
  unlocked_at TIMESTAMPTZ,
  mastered_at TIMESTAMPTZ,
  UNIQUE(user_id, scenario_id)
);

-- Enable RLS on user_scenario_progress
ALTER TABLE public.user_scenario_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own scenario progress" 
ON public.user_scenario_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own scenario progress" 
ON public.user_scenario_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scenario progress" 
ON public.user_scenario_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create badges table
CREATE TABLE public.badges (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  unlocks_content TEXT
);

-- Enable RLS on badges (public read access)
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Badges are viewable by everyone" 
ON public.badges 
FOR SELECT 
USING (true);

-- Create user_badges junction table
CREATE TABLE public.user_badges (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id INTEGER NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  achieved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Enable RLS on user_badges
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own badges" 
ON public.user_badges 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own badges" 
ON public.user_badges 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Insert initial data for auto negotiation scenario
INSERT INTO public.scenarios (title, description, location_context, cultural_briefing) VALUES
('Auto Negotiation', 'Learn to negotiate auto rickshaw fares in Koramangala traffic', 'Koramangala 5th Block, evening rush hour', 'Evening rates often higher, drivers prefer short distances during traffic');

-- Insert initial vocabulary words
INSERT INTO public.words (id, kannada_script, english_translation, roman_pronunciation, cultural_context, memory_association) VALUES
('price_inquiry', 'ಎಷ್ಟು ಆಗುತ್ತೆ?', 'How much?', 'Eshtu aagutte?', 'Critical for any transaction', 'S-two for asking the amount'),
('too_expensive', 'ಹೆಚ್ಚು ಆಗಿದೆ', 'Too expensive', 'Hecchu aagide', 'Say politely, not aggressively', 'Hech-chu like catch-you'),
('reduce_please', 'ಕಡಿಮೆ ಮಾಡಿ', 'Reduce please', 'Kadime maadi', 'Always ask politely with smile', 'Kadime sounds like cut-me'),
('okay_agreed', 'ಸರಿ', 'Okay', 'Sari', 'Universal agreement word', 'Same as Hindi sari'),
('forum_to_koramangala', 'ಫೋರಂ ಮಾಲ್‌ನಿಂದ ಕೊರಮಂಗಲಕ್ಕೆ', 'Forum Mall to Koramangala', 'Forum mall nindu Koramangalakke', 'Always mention well-known landmark first', 'nindu means from, kke means to'),
('meter_please', 'ಮೀಟರ್ ಇಟ್ಟು ಹೋಗಿ', 'By meter please', 'Meter ittu hogi', 'Request meter usage politely', 'Meter ittu like meter put');

-- Link words to auto negotiation scenario
INSERT INTO public.scenario_words (scenario_id, word_id, learning_priority, frequency_in_scenario) VALUES
(1, 'price_inquiry', 1, '100%'),
(1, 'too_expensive', 2, '70%'),
(1, 'reduce_please', 2, '70%'),
(1, 'okay_agreed', 1, '90%'),
(1, 'forum_to_koramangala', 1, '100%'),
(1, 'meter_please', 2, '60%');

-- Insert initial badges
INSERT INTO public.badges (name, description, unlocks_content) VALUES
('Koramangala Navigator', 'Master auto scenarios in Koramangala area', 'Indiranagar scenarios'),
('Bargaining Expert', 'Successfully negotiate 10 auto fares', 'Market shopping scenarios'),
('Pronunciation Master', 'Achieve 90% accuracy in speech recognition', 'Advanced conversation scenarios');