<template>
  <div class="w-full h-screen bg-gray-900 relative">
    <Canvas ref="drawingCanvas" class="absolute inset-0"></Canvas>
  </div>
</template>

<script setup lang="ts">
import { useSupabase } from '@/composables/useSupabase';

const drawingCanvas = ref<HTMLCanvasElement | null>(null);
const route = useRoute();
const { supabase } = useSupabase();

onMounted(async () => {
  const { sessionId, newSession } = route.query;

  if (!sessionId) {
    console.error('Session ID is required.');
    return;
  }

  if (newSession === 'true') {
    console.log('Initializing a new canvas.');
  } else {
    console.log(`Fetching existing canvas data for session: ${sessionId}`);
    const { data, error } = await supabase
      .from('canvases')
      .select('data')
      .eq('session_id', sessionId)
      .single();

    if (error) {
      console.error('Error fetching canvas data:', error.message);
    } else {
      //retrieve the existing canvas data, but in this case we are not saving any data of the canvas
    }
  }
});
</script>
