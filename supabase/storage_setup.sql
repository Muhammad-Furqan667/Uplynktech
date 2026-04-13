-- BUCKET INITIALIZATION: Instructors image
-- Ensures the storage container exists for Academy instructor photos.
---------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('Instructors image', 'Instructors image', true)
ON CONFLICT (id) DO NOTHING;
