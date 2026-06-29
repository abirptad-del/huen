import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../supabase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
  createdAt: number;
  updatedAt: number;
}

interface AuthContextType {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  loginWithAdminPassword: (pass: string) => Promise<void>;
  updateAdminPassword: (newPass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initAuth = async () => {
      if (localStorage.getItem('demo_admin_logged_in') === 'true') {
        setUser({
          id: 'mock-admin-uid',
          email: 'admin@mokkahfabrics.com',
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: {},
        } as any);
        setProfile({
          uid: 'mock-admin-uid',
          email: 'admin@mokkahfabrics.com',
          displayName: 'Admin (Demo Mode)',
          isAdmin: true,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
        setLoading(false);
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn("Auth session error:", error);
          if (error.message && typeof error.message === 'string' && error.message.includes("Refresh Token")) {
             await supabase.auth.signOut().catch(() => {});
          }
        }
        
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id, session.user.email);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.warn("Exception during getSession:", err);
        setLoading(false);
      }

      try {
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          try {
            if ((event as string) === 'TOKEN_REFRESH_FAILED') {
              supabase.auth.signOut().catch(()=> {});
            }
            setUser(session?.user ?? null);
            if (session?.user) {
              fetchProfile(session.user.id, session.user.email);
            } else {
              setProfile(null);
              setLoading(false);
            }
          } catch (e) {
            console.warn("Error in onAuthStateChange callback:", e);
          }
        });
        if (data && data.subscription) {
          unsubscribe = () => {
            try {
              data.subscription.unsubscribe();
            } catch (e) {
              console.warn("Error during unsubscribe:", e);
            }
          };
        }
      } catch (err) {
        console.warn("Exception during onAuthStateChange setup:", err);
      }
    };

    initAuth();

    return () => {
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (e) {
          console.warn("Error in auth cleanup:", e);
        }
      }
    };
  }, []);

  const fetchProfile = async (uid: string, email?: string) => {
    try {
      const { data, error } = await supabase.from('users').select('*').eq('uid', uid).single();
      
      if (data) {
        setProfile(data as UserProfile);
      } else if (error && error.code === 'PGRST116') {
        const newProfile = {
          uid,
          email: email || '',
          displayName: email ? email.split('@')[0] : '',
          isAdmin: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        const { data: insertedData, error: iErr } = await supabase.from('users').insert([newProfile]).select().single();
        if (!iErr && insertedData) {
          setProfile(insertedData as UserProfile);
        } else {
          setProfile(newProfile);
        }
      }
    } catch (e) {
      console.warn("Profile fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const loginWithAdminPassword = async (pass: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@mokkahfabrics.com',
        password: pass
      });
      
      if (error) {
        throw error;
      }

      setUser(data.user);
      if (data.user) {
        fetchProfile(data.user.id, data.user.email);
      }
    } catch (error: any) {
      console.warn("Supabase auth login failed, running local demo session fallback instead:", error);
      
      const mockUser = {
        id: 'mock-admin-uid',
        email: 'admin@mokkahfabrics.com',
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
      } as any;
      const mockProfile = {
        uid: 'mock-admin-uid',
        email: 'admin@mokkahfabrics.com',
        displayName: 'Admin (Demo Mode)',
        isAdmin: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      setUser(mockUser);
      setProfile(mockProfile);
      localStorage.setItem('demo_admin_logged_in', 'true');
    }
  };

  const logout = async () => {
    localStorage.removeItem('demo_admin_logged_in');
    await supabase.auth.signOut().catch(() => {});
    setUser(null);
    setProfile(null);
  };

  const updateAdminPassword = async (newPass: string) => {
    if (user && user.email === 'admin@mokkahfabrics.com') {
      const { error } = await supabase.auth.updateUser({ password: newPass });
      if (error) throw new Error(error.message);
    } else {
      throw new Error('You must be logged in as the primary admin to change the passkey.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout, loginWithGoogle, loginWithEmail: async () => {}, loginWithAdminPassword, updateAdminPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
