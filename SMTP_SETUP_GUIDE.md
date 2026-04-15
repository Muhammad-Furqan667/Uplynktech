# 🚀 Final Setup: SMTP & Lead Tracking

Follow these 3 simple steps to get your lead system and automated emails working perfectly.

---

### Step 1: Fix Permissions (Run in Supabase SQL Editor)
You need to tell the database that it's okay for the website to update a lead's status if an email fails.

1.  Open your **Supabase Dashboard** and go to the **SQL Editor**.
2.  **Copy and Run** this script:

```sql
-- Allow the website to track if an email failed
DROP POLICY IF EXISTS "Allow public SMTP failure logging" ON public.contact_leads;
CREATE POLICY "Allow public SMTP failure logging" 
ON public.contact_leads 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

-- Ensure your security is enabled
ALTER TABLE public.contact_leads ENABLE ROW LEVEL SECURITY;
```

---

### Step 2: Update Your Edge Function Code
I have fixed the imports in the code so you don't get the "Failed to bundle" error in the Supabase editor.

1.  Open the file in your code editor: `supabase/functions/send-contact-email/index.ts`
2.  **Copy all of its content**.
3.  Go to the **Edge Functions** section in your Supabase Dashboard.
4.  Update your `send-contact-email` function with this new code. 
    > [!NOTE]
    > If you don't have a web editor in Supabase, you usually deploy this from your computer terminal by running:
    > `supabase functions deploy send-contact-email`

---

### Step 3: Verify Your Gmail Settings (Run in Supabase SQL Editor)
Ensure your credentials haven't been lost or set to dummy values.

1.  In the **SQL Editor**, run this to check your current settings:
```sql
SELECT * FROM public.erp_settings WHERE key IN ('GOOGLE_EMAIL', 'GOOGLE_APP_PASSWORD');
```
2.  **If they are wrong**, run this to fix them (Replacing the placeholders with your real info):
```sql
INSERT INTO public.erp_settings (key, value) 
VALUES 
('GOOGLE_EMAIL', 'your-real-email@gmail.com'),
('GOOGLE_APP_PASSWORD', 'your-real-app-password')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
```

---

### Step 4: Final Test
1.  Refresh your **Consultation Page** (`/consultation`).
2.  Submit the form again.
3.  **Check your Gmail "Sent" folder**: You should see the automated acknowledgment.
4.  **Check your ERP Mailbox**: You should see the new lead from "Sarmad Durrani".

---

> [!TIP]
> If you still see no email, look at the lead in your ERP. If you see a red **"SMTP OFFLINE"** badge, it means your App Password is likely incorrect or expired.
