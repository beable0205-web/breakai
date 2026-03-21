-- Create the table for daily market summaries
CREATE TABLE public.market_summaries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date date UNIQUE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.market_summaries ENABLE ROW LEVEL SECURITY;

-- Allow public read access so the frontend can display the data
CREATE POLICY "Enable public read access" ON public.market_summaries
  FOR SELECT USING (true);

-- Allow anonymous inserts (Required because the API route uses standard ANON key)
CREATE POLICY "Enable anonymous insert" ON public.market_summaries
  FOR INSERT WITH CHECK (true);

-- Allow anonymous updates (Required for the 'upsert' command in case the cron runs twice)
CREATE POLICY "Enable anonymous update" ON public.market_summaries
  FOR UPDATE USING (true) WITH CHECK (true);
