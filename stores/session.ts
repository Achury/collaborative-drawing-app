import { defineStore } from 'pinia';
import { useSupabase } from '@/composables/useSupabase';

export const useSessionStore = defineStore('session', {
  state: () => ({
    user: null as any, // Current user object or null
    isAuthenticated: false,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async register(email: string, password: string, displayName: string) {
      try {
        this.loading = true;
        const { supabase } = useSupabase();

        // Sign up the user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName }, // Custom user metadata
          },
        });

        if (error) throw error;

        // Set the user state
        this.user = data.user;
        this.isAuthenticated = !!data.user;
      } catch (err: any) {
        this.error = err.message || 'An error occurred during registration.';
      } finally {
        this.loading = false;
      }
    },

    async login(email: string, password: string) {
      try {
        this.loading = true;
        const { supabase } = useSupabase();

        // Sign in the user
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Set the user state
        this.user = data.user;
        this.isAuthenticated = !!data.user;
      } catch (err: any) {
        this.error = err.message || 'An error occurred during login.';
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        const { supabase } = useSupabase();

        // Sign out the user
        const { error } = await supabase.auth.signOut();

        if (error) throw error;

        // Reset the state
        this.user = null;
        this.isAuthenticated = false;
      } catch (err: any) {
        this.error = err.message || 'An error occurred during logout.';
      }
    },

    async fetchUser() {
      try {
        const { supabase } = useSupabase();

        // Fetch the current user
        const { data, error } = await supabase.auth.getUser();

        if (error) throw error;

        // Update the state
        this.user = data.user;
        this.isAuthenticated = !!data.user;
      } catch (err: any) {
        this.error =
          err.message || 'An error occurred while fetching the user.';
      }
    },

    listenToAuthChanges() {
      const { supabase } = useSupabase();

      // Listen to authentication state changes
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
          this.user = session?.user || null;
          this.isAuthenticated = !!this.user;
        } else if (event === 'SIGNED_OUT') {
          this.user = null;
          this.isAuthenticated = false;
        }
      });
    },
  },
});
