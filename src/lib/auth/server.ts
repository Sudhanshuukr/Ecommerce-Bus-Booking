import { cookies } from 'next/headers';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { apiError } from '@/lib/api/response';
import { AppRole, AuthUserSession, UserProfile, normalizeRole } from './types';

export async function getCurrentAuthUser(req?: Request): Promise<AuthUserSession | null> {
  const supabase = getSupabaseServerClient();

  let token: string | undefined;

  if (req) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    if (!token) {
      const cookieHeader = req.headers.get('cookie');
      if (cookieHeader) {
        const match = cookieHeader.match(/sb-access-token=([^;]+)/);
        if (match) token = match[1];
      }
    }
  }

  if (!token) {
    try {
      const cookieStore = await cookies();
      const tokenCookie = cookieStore.get('sb-access-token');
      if (tokenCookie) {
        token = tokenCookie.value;
      }
    } catch {
      // Ignore if outside request context
    }
  }

  if (!token) {
    return null;
  }

  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData.user) {
    return null;
  }

  const user = authData.user;

  // Fetch application profile from public.users
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profileData } = await (supabase.from('users') as any)
    .select('*')
    .eq('id', user.id)
    .single();

  const userEmail = (user.email || profileData?.email || '').toLowerCase();
  const isTargetOperator = userEmail === 'sudhanshukr388@gmail.com';

  const role = isTargetOperator ? 'operator' : normalizeRole(profileData?.role);
  const operatorId = isTargetOperator
    ? (profileData?.operator_id || 'a0000000-0000-0000-0000-000000000001')
    : (profileData?.operator_id || null);

  const profile: UserProfile = {
    id: user.id,
    email: user.email || profileData?.email || '',
    fullName: profileData?.full_name || user.user_metadata?.full_name || null,
    phone: profileData?.phone || null,
    role,
    operatorId,
    createdAt: profileData?.created_at || user.created_at,
  };

  return {
    user: {
      id: user.id,
      email: user.email || '',
    },
    profile,
  };
}

export async function requireAuth(req?: Request) {
  const userSession = await getCurrentAuthUser(req);
  if (!userSession) {
    return {
      session: null,
      errorResponse: apiError('Authentication required. Please log in.', 'UNAUTHENTICATED', 401),
    };
  }
  return { session: userSession, errorResponse: null };
}

export async function requireRole(allowedRoles: AppRole[], req?: Request) {
  const { session, errorResponse } = await requireAuth(req);
  if (errorResponse || !session) {
    return { session: null, errorResponse };
  }

  if (!allowedRoles.includes(session.profile.role)) {
    return {
      session: null,
      errorResponse: apiError(
        'Access denied. You do not have permission to access this resource.',
        'FORBIDDEN',
        403
      ),
    };
  }

  return { session, errorResponse: null };
}
