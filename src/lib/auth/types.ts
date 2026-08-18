export type AppRole = 'customer' | 'platform_admin' | 'operator' | 'driver' | 'developer';

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
}
