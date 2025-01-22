import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ref } from 'vue';

// Function to generate a random color in hexadecimal format
const generateRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

let supabase: SupabaseClient | null = null;

interface Session {
  id: string;
  display_name: string;
  created_at: string;
  users_in_session: string[];
}

export const useSupabase = () => {
  if (!supabase) {
    const config = useRuntimeConfig();
    const supabaseUrl = config.public.supabaseUrl as string;
    const supabaseAnonKey = config.public.supabaseAnonKey as string;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Supabase URL and anon key must be provided in runtime config.'
      );
    }

    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  // Refs for storing session info
  const sessionId = ref<string>('');
  const usersInSession = ref<string[]>([]);

  // Create a session in Supabase
  const createSession = async (displayName: string) => {
    // Get the authenticated user's ID
    const { data: authData, error: authError } = await supabase!.auth.getUser();
    if (authError || !authData?.user) {
      console.error('User is not authenticated', authError);
      return;
    }

    const userId = authData.user.id; // Accessing the user ID
    const userColor = generateRandomColor();

    // Check if the user exists in the users table
    const { data: userData, error: userError } = await supabase!
      .from('users')
      .select('id, display_name')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      // If the user doesn't exist, insert them into the users table

      const { error: insertUserError } = await supabase!
        .from('users')
        .upsert([{ id: userId, display_name: displayName, color: userColor }]);

      if (insertUserError) {
        console.error(
          'Error inserting user into users table:',
          insertUserError
        );
        return;
      }
    }

    // Now that the user exists, create the session
    const { data, error } = await supabase!
      .from('sessions')
      .insert([
        {
          display_name: displayName,
          created_at: new Date().toISOString(),
          users_in_session: [displayName],
          creator_id: userId, // Set the creator_id to the authenticated user's ID
        },
      ])
      .select('id')
      .single<{ id: string }>(); // Explicitly type the response

    if (error) {
      console.error('Error creating session:', error);
      return;
    }

    sessionId.value = data.id;
    const { error: canvasError } = await supabase!.from('canvases').insert([
      {
        session_id: sessionId.value,
        data: {}, // Initialize with an empty canvas
      },
    ]);

    if (canvasError) {
      console.error('Error creating canvas:', canvasError);
      return;
    }
    subscribeToSessionUsers(data.id);
  };

  // Join a session in Supabase
  const joinSession = async (sessionIdToJoin: string, displayName: string) => {
    const { error } = await supabase!
      .from('sessions')
      .update({ users_in_session: [...usersInSession.value, displayName] })
      .eq('id', sessionIdToJoin);

    if (error) {
      console.error('Error joining session:', error);
      return;
    }

    sessionId.value = sessionIdToJoin;

    // Subscribe to session updates
    subscribeToSessionUsers(sessionIdToJoin);
  };

  // Subscribe to session users in real-time
  const subscribeToSessionUsers = (sessionId: string) => {
    supabase!
      .channel(`session:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          const updatedSession = payload.new as Session;
          usersInSession.value = updatedSession.users_in_session || [];
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to session ${sessionId}`);
        }
      });
  };

  return {
    supabase,
    createSession,
    joinSession,
    sessionId,
    usersInSession,
  };
};
