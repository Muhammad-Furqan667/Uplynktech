-- ==================================================
-- HARDENED SECURITY: STRICT ADMINISTRATIVE ACCESS
-- ==================================================

-- These policies ensure that ONLY users with the 'Admin' role 
-- in the profiles table can modify technical content.

-- 1. display_services
CREATE POLICY "Admin CRUD for services" ON public.display_services
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'Admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'Admin'));

-- 2. display_courses
CREATE POLICY "Admin CRUD for courses" ON public.display_courses
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'Admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'Admin'));

-- 3. display_projects
CREATE POLICY "Admin CRUD for projects" ON public.display_projects
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'Admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'Admin'));

-- 4. display_team
CREATE POLICY "Admin CRUD for team" ON public.display_team
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'Admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'Admin'));

-- 5. display_project_categories
CREATE POLICY "Admin CRUD for categories" ON public.display_project_categories
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'Admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'Admin'));
