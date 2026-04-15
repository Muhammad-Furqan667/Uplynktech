-- ==================================================
-- IDEMPOTENT MIGRATION: FRONT-END ROLE & PERMISSIONS
-- ==================================================

-- 1. UPDATE PROFILE ROLE CONSTRAINT
-- ------------------------------------------
DO $$ 
BEGIN
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('Admin', 'User', 'Contact', 'Front-end'));
END $$;

-- 2. UPDATE DISPLAY CONTENT POLICIES (CRUD)
-- ------------------------------------------

-- display_services
DROP POLICY IF EXISTS "Admin CRUD for services" ON public.display_services;
CREATE POLICY "Full CRUD for Display Managers" ON public.display_services
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Front-end')))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Front-end')));

-- display_courses
DROP POLICY IF EXISTS "Admin CRUD for courses" ON public.display_courses;
CREATE POLICY "Full CRUD for Display Managers" ON public.display_courses
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Front-end')))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Front-end')));

-- display_projects
DROP POLICY IF EXISTS "Admin CRUD for projects" ON public.display_projects;
CREATE POLICY "Full CRUD for Display Managers" ON public.display_projects
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Front-end')))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Front-end')));

-- display_team
DROP POLICY IF EXISTS "Admin CRUD for team" ON public.display_team;
CREATE POLICY "Full CRUD for Display Managers" ON public.display_team
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Front-end')))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Front-end')));

-- display_project_categories
DROP POLICY IF EXISTS "Admin CRUD for categories" ON public.display_project_categories;
CREATE POLICY "Full CRUD for Display Managers" ON public.display_project_categories
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Front-end')))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Front-end')));

-- display_reviews
DROP POLICY IF EXISTS "Admin CRUD for reviews" ON public.display_reviews;
CREATE POLICY "Full CRUD for Display Managers" ON public.display_reviews
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Front-end')))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Front-end')));


-- 3. UPDATE STORAGE STORAGE POLICIES
-- ------------------------------------------

-- memebrs images
DROP POLICY IF EXISTS "Admin CRUD for Members" ON storage.objects;
CREATE POLICY "CRUD for Display Managers - Members" ON storage.objects 
FOR ALL TO authenticated
USING (bucket_id = 'memebrs images' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Front-end')))
WITH CHECK (bucket_id = 'memebrs images' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Front-end')));

-- project image
DROP POLICY IF EXISTS "Admin CRUD for Projects" ON storage.objects;
CREATE POLICY "CRUD for Display Managers - Projects" ON storage.objects 
FOR ALL TO authenticated
USING (bucket_id = 'project image' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Front-end')))
WITH CHECK (bucket_id = 'project image' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Front-end')));

-- Instructors image (Ensuring it exists and has policies)
DROP POLICY IF EXISTS "CRUD for Display Managers - Instructors" ON storage.objects;
CREATE POLICY "CRUD for Display Managers - Instructors" ON storage.objects 
FOR ALL TO authenticated
USING (bucket_id = 'Instructors image' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Front-end')))
WITH CHECK (bucket_id = 'Instructors image' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Front-end')));
