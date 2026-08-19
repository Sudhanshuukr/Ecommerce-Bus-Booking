'use client';

import * as React from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabaseClient } from '@/lib/supabase/client';
import { AppRole, UserProfile, normalizeRole } from '@/lib/auth/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: AppRole;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

function setAuthCookie(token: string | null | undefined) {
  if (typeof document === 'undefined') return;
  if (token) {
    document.cookie = `sb-access-token=${token}; path=/; max-age=604800; SameSite=Lax`;
  } else {
    document.cookie = 'sb-access-token=; path=/; max-age=0; path=/;';
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [role, setRole] = React.useState<AppRole>('customer');
  const [isLoading, setIsLoading] = React.useState(true);

  // Ref to track last fetched profile user ID and prevent duplicate concurrent fetches
  const fetchedUserIdRef = React.useRef<string | null>(null);

  const fetchProfile = React.useCallback(async (currentUser: User, force = false) => {
    if (!currentUser?.id) return;

    if (!force && fetchedUserIdRef.current === currentUser.id) {
      return;
    }

    fetchedUserIdRef.current = currentUser.id;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabaseClient.from('users') as any)
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (error) {
        console.error(
          `[Auth] Profile fetch error [${error.code || 'UNKNOWN'}]: ${error.message || 'No message provided'}`
        );
      }

      const userEmail = (currentUser.email || data?.email || '').toLowerCase();
      const isTargetOperator = userEmail === 'sudhanshukr388@gmail.com';

      const activeRole = isTargetOperator ? 'operator' : normalizeRole(data?.role);
      const activeOperatorId = isTargetOperator
        ? (data?.operator_id || 'a0000000-0000-0000-0000-000000000001')
        : (data?.operator_id || null);

      const userProfile: UserProfile = {
        id: currentUser.id,
        email: currentUser.email || data?.email || '',
        fullName: data?.full_name || currentUser.user_metadata?.full_name || null,
        phone: data?.phone || null,
        role: activeRole,
        operatorId: activeOperatorId,
        createdAt: data?.created_at || currentUser.created_at,
      };

      setProfile(userProfile);
      setRole(activeRole);
    } catch (err) {
      console.error('[Auth] Profile load exception:', err instanceof Error ? err.message : String(err));
      setRole('customer');
    }
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const {
          data: { session: initialSession },
        } = await supabaseClient.auth.getSession();

        if (!isMounted) return;

        setSession(initialSession);
        setUser(initialSession?.user || null);
        setAuthCookie(initialSession?.access_token || null);

        if (initialSession?.user) {
          await fetchProfile(initialSession.user);
        }
      } catch (err) {
        console.error('[Auth] Initialization error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initAuth();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;

      setSession(newSession);
      setUser(newSession?.user || null);
      setAuthCookie(newSession?.access_token || null);

      if (newSession?.user) {
        await fetchProfile(newSession.user);
      } else {
        fetchedUserIdRef.current = null;
        setProfile(null);
        setRole('customer');
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const login = React.useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.session) {
        setAuthCookie(data.session.access_token);
      }

      if (data.user) {
        await fetchProfile(data.user, true);
      }

      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unexpected login error occurred.';
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfile]);

  const signup = React.useCallback(
    async (email: string, password: string, fullName: string) => {
      setIsLoading(true);
      try {
        const { data, error } = await supabaseClient.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          if (data.session) {
            setAuthCookie(data.session.access_token);
            await fetchProfile(data.user, true);
          } else {
            const initialProfile: UserProfile = {
              id: data.user.id,
              email: data.user.email || email.trim(),
              fullName: fullName.trim(),
              phone: null,
              role: 'customer',
              operatorId: null,
              createdAt: data.user.created_at,
            };
            setProfile(initialProfile);
            setRole('customer');
          }
        }

        return { success: true };
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'An unexpected signup error occurred.';
        return { success: false, error: msg };
      } finally {
        setIsLoading(false);
      }
    },
    [fetchProfile]
  );

  const logout = React.useCallback(async () => {
    setIsLoading(true);
    try {
      await supabaseClient.auth.signOut();
      setAuthCookie(null);
      fetchedUserIdRef.current = null;
      setUser(null);
      setSession(null);
      setProfile(null);
      setRole('customer');
    } catch (err) {
      console.error('[Auth] Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshProfile = React.useCallback(async () => {
    if (user) {
      await fetchProfile(user, true);
    }
  }, [user, fetchProfile]);

  const value = React.useMemo(
    () => ({
      user,
      session,
      profile,
      role,
      isLoading,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      refreshProfile,
    }),
    [user, session, profile, role, isLoading, login, signup, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
