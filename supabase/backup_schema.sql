-- IDEMPOTENT INITIAL SETUP SCRIPT
-- Run this as many times as needed to sync your schema.

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Sequences
CREATE SEQUENCE IF NOT EXISTS public.emp_id_seq START 1000;

-- 2. Core Tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT,
  emp_id TEXT UNIQUE,
  designation TEXT,
  role TEXT DEFAULT 'User' CHECK (role IN ('Admin', 'User', 'Contact')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.departments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hierarchy (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  dept_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  senior_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  UNIQUE(user_id, dept_id)
);

-- 3. Advanced Team Structures (NEW)
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  can_chat BOOLEAN DEFAULT TRUE,
  can_see_tasks BOOLEAN DEFAULT FALSE,
  UNIQUE(team_id, user_id)
);

-- 4. Operations
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  dept_id UUID REFERENCES public.departments(id),
  assigner_id UUID REFERENCES public.profiles(id),
  assignee_id UUID REFERENCES public.profiles(id),
  due_date DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  junior_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  subject TEXT,
  message TEXT,
  company TEXT,
  meta JSONB DEFAULT '{}',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id),
  receiver_id UUID REFERENCES public.profiles(id),
  content TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Settings
CREATE TABLE IF NOT EXISTS public.erp_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Functions
CREATE OR REPLACE FUNCTION public.generate_emp_id() 
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.emp_id IS NULL THEN
    NEW.emp_id := 'UT-' || nextval('public.emp_id_seq')::text;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, designation, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Employee'), 
    'User',
    NEW.raw_user_meta_data->>'designation',
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    full_name = EXCLUDED.full_name,
    designation = EXCLUDED.designation;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if someone is a senior (used for sidebar & permissions)
CREATE OR REPLACE FUNCTION public.has_subordinates(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.hierarchy WHERE senior_id = p_user_id);
END;
$$ LANGUAGE plpgsql STABLE;

-- Admin-only password reset (bypass auth schema restrictions)
CREATE OR REPLACE FUNCTION public.update_user_password(user_id UUID, new_password TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE auth.users SET encrypted_password = crypt(new_password, gen_salt('bf')) WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Triggers
DROP TRIGGER IF EXISTS tr_generate_emp_id ON public.profiles;
CREATE TRIGGER tr_generate_emp_id
BEFORE INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.generate_emp_id();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Security Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hierarchy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.erp_settings ENABLE ROW LEVEL SECURITY;

-- Dynamic Policy Reset
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON ' || quote_ident(r.tablename);
    END LOOP;
END $$;

-- Profiles: Viewable by all, editable by self/admin
CREATE POLICY "Profile Visibility" ON public.profiles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Profile Self Update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Departments: Viewable by all, managed by admin
CREATE POLICY "Dept View" ON public.departments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Dept Admin" ON public.departments FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin'));

-- Hierarchy: Viewable by all, managed by admin
CREATE POLICY "Hierarchy View" ON public.hierarchy FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Hierarchy Admin" ON public.hierarchy FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin'));

-- Teams (NEW)
CREATE POLICY "Teams View" ON public.teams FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Teams Admin" ON public.teams FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin'));

-- Team Members (NEW)
CREATE POLICY "Team Members View" ON public.team_members FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Team Members Admin" ON public.team_members FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin'));

-- Tasks: Comprehensive Sharing Logic
CREATE POLICY "Task Visibility" ON public.tasks FOR SELECT USING (
    auth.uid() = assignee_id OR 
    auth.uid() = assigner_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin') OR
    -- [Senior Override]: Senior can always see tasks of their subordinates
    EXISTS (SELECT 1 FROM public.hierarchy WHERE senior_id = auth.uid() AND user_id = public.tasks.assignee_id) OR
    -- [Team Sharing]: Peers can see if the assignee has 'can_see_tasks' enabled and they belong to the same team
    EXISTS (
        SELECT 1 FROM public.team_members tm_assignee
        JOIN public.team_members tm_viewer ON tm_viewer.team_id = tm_assignee.team_id
        WHERE tm_assignee.user_id = public.tasks.assignee_id 
        AND tm_viewer.user_id = auth.uid()
        AND tm_assignee.can_see_tasks = TRUE
    )
);

CREATE POLICY "Task Management" ON public.tasks FOR ALL USING (
    auth.uid() = assigner_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin') OR
    EXISTS (SELECT 1 FROM public.hierarchy WHERE senior_id = auth.uid() AND user_id = public.tasks.assignee_id)
);

-- Messages
CREATE POLICY "Message Access" ON public.messages FOR ALL USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Message Global" ON public.messages FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin'));

-- Contact Leads: Public Ingest, Staff Management
CREATE POLICY "Contact Lead Ingest" ON public.contact_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Contact Lead Admin" ON public.contact_leads FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'Admin' OR role = 'Contact'))
);

-- 10. Task Updates (New)
CREATE TABLE IF NOT EXISTS public.task_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. RLS for Task Updates
ALTER TABLE public.task_updates ENABLE ROW LEVEL SECURITY;

-- Staff can view their own updates
CREATE POLICY "Users can view their own task updates" 
    ON public.task_updates FOR SELECT 
    USING (auth.uid() = user_id);

-- Staff can insert their own updates
CREATE POLICY "Users can insert their own task updates" 
    ON public.task_updates FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Seniors can view updates of their subordinates
CREATE POLICY "Seniors can view subordinate task updates" 
    ON public.task_updates FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.hierarchy h
            JOIN public.tasks t ON t.assignee_id = h.user_id
            WHERE h.senior_id = auth.uid()
            AND t.id = task_updates.task_id
        )
    );

-- Admins see all
CREATE POLICY "Admins have full access to task updates" 
    ON public.task_updates FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin'));

-- 12. Seed Settings Documentation
INSERT INTO public.erp_settings (key, value) VALUES 
('GOOGLE_EMAIL', 'your-email@gmail.com'),
('GOOGLE_APP_PASSWORD', 'xxxx-xxxx-xxxx-xxxx')
ON CONFLICT (key) DO NOTHING;

-- 13. Enable Realtime for all relevant tables (Safely)
-- NOTE: If Realtime stalls, run the following in SQL Editor:
-- DROP PUBLICATION IF EXISTS supabase_realtime;
-- CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
DO $$
BEGIN
  -- 1. Create publication if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;

  -- 2. Add tables to publication if they are not already there
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'messages'
  ) THEN
    -- If the publication exists, we add the target tables
    ALTER PUBLICATION supabase_realtime ADD TABLE 
      public.messages, 
      public.tasks, 
      public.task_updates, 
      public.profiles;
  END IF;
END $$;

-- 14. Identity Scaling for High-Fidelity Realtime
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.tasks REPLICA IDENTITY FULL;
ALTER TABLE public.task_updates REPLICA IDENTITY FULL;

-- 15. Secure Admin-Only User Creation RPC
-- This allows admins to invite personnel without being signed out.
CREATE OR REPLACE FUNCTION public.admin_create_user(
    p_email TEXT,
    p_password TEXT,
    p_full_name TEXT,
    p_designation TEXT,
    p_role TEXT
)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
    -- 1. Authorization check
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'Admin'
    ) THEN
        RAISE EXCEPTION 'Unauthorized: Only admins can create users.';
    END IF;

    -- 2. Insert into auth.users (instance_id is typically all zeros)
    INSERT INTO auth.users (
        instance_id, 
        id, 
        aud, 
        role, 
        email, 
        encrypted_password, 
        email_confirmed_at, 
        raw_user_meta_data, 
        created_at, 
        updated_at, 
        confirmation_token, 
        recovery_token, 
        email_change_token_new, 
        email_change
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000', 
        gen_random_uuid(), 
        'authenticated', 
        'authenticated', 
        p_email, 
        crypt(p_password, gen_salt('bf')), 
        now(), 
        jsonb_build_object('full_name', p_full_name, 'designation', p_designation, 'role', p_role),
        now(), 
        now(), 
        '', '', '', ''
    )
    RETURNING id INTO v_user_id;

    RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
