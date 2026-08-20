export type AppRole = 'customer' | 'platform_admin' | 'operator' | 'driver' | 'developer';

export function normalizeRole(rawRole: string | null | undefined): AppRole {
  if (!rawRole) return 'customer';
  const lower = rawRole.toLowerCase();
  if (lower === 'admin' || lower === 'platform_admin') return 'platform_admin';
  if (lower === 'operator') return 'operator';
  if (lower === 'driver') return 'driver';
  if (lower === 'developer') return 'developer';
  return 'customer';
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  role: AppRole;
  operatorId: string | null;
  createdAt: string;
}

export interface AuthUserSession {
  user: {
    id: string;
    email: string;
  };
  profile: UserProfile;
  token?: string;
}
