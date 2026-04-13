-- MatchPoint Database Schema
-- Run this in the Supabase SQL Editor

-- 1. Create the Matches table
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    job_title TEXT NOT NULL,
    candidate_name TEXT NOT NULL,
    cv_url TEXT NOT NULL,
    match_score INTEGER NOT NULL DEFAULT 0,
    matching_criteria JSONB DEFAULT '{}',
    interview_questions TEXT[] DEFAULT '{}'
);

-- 2. Set up Row Level Security (RLS)
-- Since this is a shared recruiter dashboard, we enable RLS but allow authenticated/anon access for now 
-- per the AGENTS.md instructions to keep it simple.
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to matches" 
ON public.matches FOR ALL 
USING (true);

-- 3. Storage Setup (CV Uploads)
-- Note: You must manually create a bucket named "cv-uploads" in the Supabase Dashboard
-- After creating the bucket, you can run these policies:

/*
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cv-uploads', 'cv-uploads', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access for CVs"
ON storage.objects FOR SELECT
USING ( bucket_id = 'cv-uploads' );

CREATE POLICY "Allow CV Uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'cv-uploads' );
*/
