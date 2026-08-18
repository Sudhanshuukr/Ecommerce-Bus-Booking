-- ============================================================================
-- Migration: 00004_auth_rbac_schema_update.sql
-- Description: Authentication & RBAC Schema Extension (Roles, Trigger, Profile RLS)
-- ============================================================================

-- 1. Add operator_id column to users table for Operator resource ownership
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS operator_id UUID REFERENCES public.operators(id) ON DELETE SET NULL;

-- 2. Update role constraint to support full RBAC role set
-- ('customer', 'platform_admin', 'operator', 'driver', 'developer', 'admin')
ALTER TABLE public.users
    DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE public.users
    ADD CONSTRAINT users_role_check
    CHECK (role IN ('customer', 'platform_admin', 'operator', 'driver', 'developer', 'admin'));

-- 3. Automatic Profile Provisioning Trigger on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, full_name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        NEW.email,
        'customer'
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = CASE
            WHEN EXCLUDED.full_name IS NOT NULL AND EXCLUDED.full_name <> ''
            THEN EXCLUDED.full_name
            ELSE public.users.full_name
        END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Enable RLS and define security policies for public.users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
CREATE POLICY "Admins can view all profiles" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('platform_admin', 'admin', 'developer')
        )
    );

-- 5. Bookings RLS policies for authenticated users
DROP POLICY IF EXISTS "Users can read own bookings" ON public.bookings;
CREATE POLICY "Users can read own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = user_id);

-- 6. Index on operator_id in users
CREATE INDEX IF NOT EXISTS idx_users_operator ON public.users(operator_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
