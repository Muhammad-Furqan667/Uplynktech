-- ==================================================
-- HARDENED STORAGE SECURITY: ADMIN ONLY UPLOADS
-- ==================================================

-- This script ensures that ONLY people with the 'Admin' role 
-- in your profiles table can upload or delete media.

-- 1. BUCKET: memebrs images
------------------------------------------
-- Public Read for everyone
CREATE POLICY "Public Read for Members" ON storage.objects FOR SELECT USING (bucket_id = 'memebrs images');

-- Admin CRUD (Strict Role Check)
CREATE POLICY "Admin CRUD for Members" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'memebrs images' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin'))
WITH CHECK (bucket_id = 'memebrs images' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin'));


-- 2. BUCKET: project image
------------------------------------------
-- Public Read for everyone
CREATE POLICY "Public Read for Projects" ON storage.objects FOR SELECT USING (bucket_id = 'project image');

-- Admin CRUD (Strict Role Check)
CREATE POLICY "Admin CRUD for Projects" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'project image' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin'))
WITH CHECK (bucket_id = 'project image' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin'));
