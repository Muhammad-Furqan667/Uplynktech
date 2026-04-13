-- 6. display_reviews
CREATE TABLE IF NOT EXISTS public.display_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    quote TEXT NOT NULL,
    author TEXT NOT NULL,
    title TEXT,
    company TEXT,
    is_featured BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE RLS
ALTER TABLE public.display_reviews ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICY
CREATE POLICY "Allow public read-only access to reviews" ON public.display_reviews FOR SELECT USING (true);

-- ADMIN CRUD POLICY
CREATE POLICY "Admin CRUD for reviews" ON public.display_reviews
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'Admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'Admin'));

-- INITIAL DATA
INSERT INTO public.display_reviews (quote, author, title, company)
VALUES 
('UPLYNK didn''t just build our internal platform; they overhauled our entire cloud architecture. Their unified engineering team acts like a true extension of our own.', 'Marcus Vance', 'Chief Technology Officer', 'Aether Dynamics'),
('We were burning cash on inefficient operational workflows. UPLYNK integrated a custom LLM solution that instantly automated 40% of our tier-1 support.', 'Elena Rostova', 'VP of Operations', 'Nexus Medical Systems'),
('The rigor and pure technical talent UPLYNK brings is unmatched. Their academy pipeline ensures they always have the sharpest minds executing our mission-critical sprints.', 'Julian Wright', 'Director of Engineering', 'FinTech Global');
