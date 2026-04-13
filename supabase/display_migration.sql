-- UPLYNK TECH - DISPLAY DATA MIGRATION
-- This script creates the public-facing 'display_' tables and populates them with initial data.

-- 1. display_services
CREATE TABLE IF NOT EXISTS public.display_services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    tagline TEXT,
    description TEXT,
    hero_icon TEXT,
    stats JSONB DEFAULT '[]',
    capabilities JSONB DEFAULT '[]',
    methodology JSONB DEFAULT '[]',
    cta_title TEXT,
    cta_desc TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. display_courses
CREATE TABLE IF NOT EXISTS public.display_courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    track_name TEXT,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    level TEXT,
    students INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Ongoing',
    start_date TIMESTAMPTZ,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. display_projects
CREATE TABLE IF NOT EXISTS public.display_projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug TEXT UNIQUE,
    category TEXT,
    title TEXT NOT NULL,
    client TEXT,
    impact TEXT,
    image TEXT,
    description TEXT,
    tech TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT FALSE,
    stats JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. display_team
CREATE TABLE IF NOT EXISTS public.display_team (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT,
    image TEXT,
    email TEXT,
    linkedin TEXT,
    is_ceo BOOLEAN DEFAULT FALSE,
    is_leadership BOOLEAN DEFAULT FALSE,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. display_project_categories
CREATE TABLE IF NOT EXISTS public.display_project_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    hero_icon TEXT,
    stats JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE RLS
ALTER TABLE public.display_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.display_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.display_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.display_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.display_project_categories ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
CREATE POLICY "Allow public read-only access to services" ON public.display_services FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to courses" ON public.display_courses FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to projects" ON public.display_projects FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to team" ON public.display_team FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to project categories" ON public.display_project_categories FOR SELECT USING (true);

-- INITIAL DATA PUSH (EXTRACTED FROM DATA FILES)

-- SERVICES
INSERT INTO public.display_services (slug, title, subtitle, tagline, description, hero_icon, stats, capabilities, methodology, cta_title, cta_desc)
VALUES 
('engineering', 'Core Engineering', 'Scalable Infrastructure & Resilient Systems', 'Architecting the foundations of digital dominance.', 'We build high-performance, mission-critical systems designed to scale from 1,000 to 1,000,000+ users with zero performance degradation.', 'FiTerminal', 
'[{"label": "Uptime SLA", "value": "99.99%"}, {"label": "Security Audits", "value": "100+"}, {"label": "Global Scale", "value": "Ready"}]',
'[{"desc": "End-to-end web & mobile engineering using modern, high-performance stacks...", "icon": "FiTerminal", "title": "Full-Stack System Architecture"}]',
'[{"step": "01", "desc": "Deep dive into your existing stack...", "title": "Discovery & Audit"}]',
'Build Your Foundation', 'Ready to architect a system that never fails?'),
('ai', 'Intelligent Automation', 'Next-Gen AI & Predictive Logic', 'Transforming complexity into automated intelligence.', 'Leverage proprietary machine learning models and generative AI systems to automate high-level decision making.', 'FiCpu', 
'[{"label": "Model Accuracy", "value": "98%+"}, {"label": "Auto-Efficiency", "value": "40%+"}]',
'[]', '[]', 'Harness the Power of AI', 'Stop manual operations. Start intelligent scaling.'),
('growth', 'Market Dominance', 'Strategic UI/UX & Creative Identity', 'Visualizing authority. Scaling reach.', 'We combine psychology-driven UI/UX design with aggressive growth funnels.', 'FiTrendingUp', 
'[{"label": "Cvr Increase", "value": "25%+"}]', '[]', '[]', 'Dominate Your Market', 'Ready to elevate your brand to the global elite?');

-- TEAM
INSERT INTO public.display_team (name, role, bio, image, is_ceo, message)
VALUES ('Hanif Ullah Khan', 'Chief Executive Officer', 'Hanif is a visionary strategist...', '/img/hanif_khan.jpeg', true, 'At UPLYNK Tech, we don''t just deliver software...');

INSERT INTO public.display_team (name, role, bio, image, email, linkedin)
VALUES 
('James Wilson', 'Head of Engineering', 'James is a senior systems architect...', '', 'james.wilson@uplynktech.com', 'https://linkedin.com'),
('Sarah Johnson', 'Operations Director', 'Sarah leads our agile delivery cycle...', '', 'sarah.johnson@uplynktech.com', 'https://linkedin.com');

-- (Note: Courses and Projects follow similar INSERT pattern for all entries)
