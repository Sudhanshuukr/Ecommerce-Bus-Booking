-- ============================================================================
-- Migration: 00005_assign_operator_user.sql
-- Description: Assign Operator role and operator_id to sudhanshukr388@gmail.com
-- ============================================================================

-- 1. Update handle_new_user trigger to assign operator role to sudhanshukr388@gmail.com
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, full_name, email, role, operator_id)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        NEW.email,
        CASE
            WHEN LOWER(NEW.email) = 'sudhanshukr388@gmail.com' THEN 'operator'
            ELSE 'customer'
        END,
        CASE
            WHEN LOWER(NEW.email) = 'sudhanshukr388@gmail.com' THEN 'a0000000-0000-0000-0000-000000000001'::uuid
            ELSE NULL
        END
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = CASE
            WHEN EXCLUDED.full_name IS NOT NULL AND EXCLUDED.full_name <> ''
            THEN EXCLUDED.full_name
            ELSE public.users.full_name
        END,
        role = CASE
            WHEN LOWER(EXCLUDED.email) = 'sudhanshukr388@gmail.com' THEN 'operator'
            ELSE public.users.role
        END,
        operator_id = CASE
            WHEN LOWER(EXCLUDED.email) = 'sudhanshukr388@gmail.com' THEN 'a0000000-0000-0000-0000-000000000001'::uuid
            ELSE public.users.operator_id
        END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update existing profile record if present
UPDATE public.users
SET
    role = 'operator',
    operator_id = 'a0000000-0000-0000-0000-000000000001'
WHERE LOWER(email) = 'sudhanshukr388@gmail.com';
