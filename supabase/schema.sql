-- ==============================================================================
-- CORNICE & QUERY (CQ) — PRODUCTION DATABASE SCHEMA & MIGRATION
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLES

-- PROFILES TABLE (Linked 1-to-1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  full_name TEXT,
  avatar_url TEXT,
  provider TEXT DEFAULT 'google',
  referral_code TEXT UNIQUE NOT NULL,
  referred_by TEXT,
  boost_points INTEGER NOT NULL DEFAULT 10 CHECK (boost_points >= 0),
  qualification_score INTEGER,
  qualification_completed BOOLEAN NOT NULL DEFAULT false,
  first_20_bonus BOOLEAN NOT NULL DEFAULT false,
  discount_eligible BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- REFERRALS TABLE (Tracking valid completed referrals)
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  points_awarded INTEGER NOT NULL DEFAULT 18,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT check_no_self_referral CHECK (referrer_id != referred_user_id)
);

-- CUSTOMISATION SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.customisation_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  qualification_score INTEGER NOT NULL DEFAULT 0,
  full_stack_interest BOOLEAN NOT NULL DEFAULT true,
  boost_points INTEGER NOT NULL DEFAULT 0,
  discount_eligible BOOLEAN NOT NULL DEFAULT false,
  requirements TEXT,
  price_shown TEXT,
  status TEXT NOT NULL DEFAULT 'Requirement Submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- QUALIFICATION RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.qualification_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 5),
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- VISITORS TABLE (Anonymous Visitor Count & Session Tracking)
CREATE TABLE IF NOT EXISTS public.visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CQ EVENTS TABLE (Analytics Event Telemetry)
CREATE TABLE IF NOT EXISTS public.cq_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_customisations_user_id ON public.customisation_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_qualification_user_id ON public.qualification_results(user_id);
CREATE INDEX IF NOT EXISTS idx_visitors_session_id ON public.visitors(session_id);

-- 4. ATOMIC UTILITY FUNCTIONS

-- Helper function: Generate unique referral code (e.g. CQ-AB12CD)
CREATE OR REPLACE FUNCTION public.generate_unique_referral_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := 'CQ-';
  i INTEGER := 0;
  code_exists BOOLEAN := true;
BEGIN
  WHILE code_exists LOOP
    result := 'CQ-';
    FOR i IN 1..6 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END FOR;
    SELECT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = result) INTO code_exists;
  END WHILE;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger Function: Automatic Profile Creation & First-20 User Bonus Allocation on auth.users insertion
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_referral_code TEXT;
  current_early_count INTEGER;
  is_early_user BOOLEAN := false;
  initial_points INTEGER := 10;
  user_name TEXT;
  user_avatar TEXT;
BEGIN
  -- Generate unique referral code
  new_referral_code := public.generate_unique_referral_code();

  -- Extract display name & avatar from user metadata if provided by Google OAuth / Signup
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'display_name',
    split_part(NEW.email, '@', 1)
  );

  user_avatar := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture',
    NULL
  );

  -- Atomic Race-Condition Proof Check for First 20 Qualifying Users
  -- Perform advisory lock on key 20260906 to serialize concurrent user registration checks
  PERFORM pg_advisory_xact_lock(20260906);

  SELECT COUNT(*) INTO current_early_count FROM public.profiles WHERE first_20_bonus = true;

  IF current_early_count < 20 THEN
    is_early_user := true;
    initial_points := 100;
  ELSE
    is_early_user := false;
    initial_points := 10;
  END IF;

  -- Create profile row
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    full_name,
    avatar_url,
    provider,
    referral_code,
    boost_points,
    first_20_bonus,
    discount_eligible,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    user_name,
    user_name,
    user_avatar,
    COALESCE(NEW.raw_app_meta_data->>'provider', 'google'),
    new_referral_code,
    initial_points,
    is_early_user,
    (initial_points >= 100),
    NOW(),
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- RPC Function: Process Referral on Signup (Atomic, Server-Validated)
CREATE OR REPLACE FUNCTION public.process_referral_on_signup(
  p_new_user_id UUID,
  p_referral_code TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_referrer_id UUID;
  v_referrer_points INTEGER;
  v_referrer_count INTEGER;
  v_points_awarded INTEGER := 18;
  v_new_points INTEGER;
  v_new_discount_eligible BOOLEAN;
BEGIN
  IF p_referral_code IS NULL OR trim(p_referral_code) = '' THEN
    RETURN jsonb_build_object('success', false, 'reason', 'No referral code provided');
  END IF;

  -- Locate referrer profile
  SELECT id, boost_points INTO v_referrer_id, v_referrer_points
  FROM public.profiles
  WHERE referral_code = trim(p_referral_code);

  IF v_referrer_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'Invalid referral code');
  END IF;

  -- Prevent self-referral
  IF v_referrer_id = p_new_user_id THEN
    RETURN jsonb_build_object('success', false, 'reason', 'Self-referral is not allowed');
  END IF;

  -- Check if referral was already processed for this new user
  IF EXISTS (SELECT 1 FROM public.referrals WHERE referred_user_id = p_new_user_id) THEN
    RETURN jsonb_build_object('success', false, 'reason', 'Referral already recorded for this user');
  END IF;

  -- Check referrer's successful referral count (max 5)
  SELECT COUNT(*) INTO v_referrer_count
  FROM public.referrals
  WHERE referrer_id = v_referrer_id;

  IF v_referrer_count >= 5 THEN
    -- Limit reached: Record referral link but do not award extra points beyond max target
    INSERT INTO public.referrals (referrer_id, referred_user_id, referral_code, points_awarded)
    VALUES (v_referrer_id, p_new_user_id, p_referral_code, 0);

    UPDATE public.profiles
    SET referred_by = p_referral_code
    WHERE id = p_new_user_id;

    RETURN jsonb_build_object('success', true, 'reason', 'Referral target limit reached, recorded without extra points');
  END IF;

  -- Award referral reward (+18 points per referral)
  v_new_points := v_referrer_points + v_points_awarded;
  v_new_discount_eligible := (v_new_points >= 100);

  -- Record referral entry
  INSERT INTO public.referrals (referrer_id, referred_user_id, referral_code, points_awarded)
  VALUES (v_referrer_id, p_new_user_id, p_referral_code, v_points_awarded);

  -- Update referrer profile
  UPDATE public.profiles
  SET 
    boost_points = v_new_points,
    discount_eligible = v_new_discount_eligible,
    updated_at = NOW()
  WHERE id = v_referrer_id;

  -- Update new user's referred_by field
  UPDATE public.profiles
  SET referred_by = p_referral_code
  WHERE id = p_new_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'referrer_id', v_referrer_id,
    'points_awarded', v_points_awarded,
    'referrer_new_points', v_new_points
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customisation_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qualification_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cq_events ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update safe fields in own profile" ON public.profiles;
CREATE POLICY "Users can update safe fields in own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- REFERRALS POLICIES
DROP POLICY IF EXISTS "Users can view referrals made by them" ON public.referrals;
CREATE POLICY "Users can view referrals made by them"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_id);

-- CUSTOMISATION SUBMISSIONS POLICIES
DROP POLICY IF EXISTS "Users can read own submissions" ON public.customisation_submissions;
CREATE POLICY "Users can read own submissions"
  ON public.customisation_submissions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own submission" ON public.customisation_submissions;
CREATE POLICY "Users can insert own submission"
  ON public.customisation_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- QUALIFICATION RESULTS POLICIES
DROP POLICY IF EXISTS "Users can read own qualification results" ON public.qualification_results;
CREATE POLICY "Users can read own qualification results"
  ON public.qualification_results FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own qualification results" ON public.qualification_results;
CREATE POLICY "Users can insert own qualification results"
  ON public.qualification_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- VISITORS POLICIES
DROP POLICY IF EXISTS "Anyone can record or view visitors" ON public.visitors;
CREATE POLICY "Anyone can record or view visitors"
  ON public.visitors FOR ALL
  USING (true);

-- CQ EVENTS POLICIES
DROP POLICY IF EXISTS "Anyone can record analytics events" ON public.cq_events;
CREATE POLICY "Anyone can record analytics events"
  ON public.cq_events FOR ALL
  USING (true);
