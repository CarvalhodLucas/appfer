-- SQL Schema for FitFernanda Supabase Database
-- Run this in the Supabase SQL Editor to set up your tables.

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Fernanda',
    goal TEXT DEFAULT 'Adelgazar',
    level TEXT DEFAULT 'Principiante',
    daily_calories INTEGER DEFAULT 1500,
    food_likes TEXT[] DEFAULT '{}',
    food_dislikes TEXT[] DEFAULT '{}',
    current_weight NUMERIC,
    goal_weight NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Humor Check-in Table
CREATE TABLE IF NOT EXISTS public.humor_checkin (
    date DATE PRIMARY KEY,
    level TEXT NOT NULL, -- 'alto', 'normal', 'bajo'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Refeições Table (Meals)
CREATE TABLE IF NOT EXISTS public.refeicoes (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    meal_type TEXT NOT NULL, -- 'desayuno', 'almuerzo', 'cena', 'snack'
    description TEXT NOT NULL,
    calories INTEGER NOT NULL DEFAULT 0,
    protein_g INTEGER DEFAULT 0,
    carbs_g INTEGER DEFAULT 0,
    fat_g INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Treinos Table (Workouts)
CREATE TABLE IF NOT EXISTS public.treinos (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    muscle_group TEXT NOT NULL,
    intensity TEXT NOT NULL, -- 'ligero', 'normal', 'intenso'
    exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Mensagens Agente Table (Chat history)
CREATE TABLE IF NOT EXISTS public.mensagens_agente (
    id SERIAL PRIMARY KEY,
    role TEXT NOT NULL, -- 'user', 'assistant'
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) Configuration
-- For simple personal usage, we can enable read/write access for anonymized users.
-- Note: Adjust policy definitions based on production security requirements.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.humor_checkin ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refeicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treinos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens_agente ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all public profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all public humor checkins" ON public.humor_checkin FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all public meals" ON public.refeicoes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all public workouts" ON public.treinos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all public messages" ON public.mensagens_agente FOR ALL USING (true) WITH CHECK (true);
