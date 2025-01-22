<template>
  <div class="w-full h-screen flex items-center justify-center bg-gray-800">
    <div class="w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-md">
      <!-- Select Option: Create New Session or Join Existing Session -->
      <div v-if="!sessionId" class="space-y-4">
        <h2 class="text-xl font-semibold text-center text-gray-100">
          Select an Option
        </h2>
        <div>
          <button
            @click="selectCreateSession"
            class="w-full bg-indigo-600 text-white py-2 rounded-md"
          >
            Create New Session
          </button>
        </div>
        <div>
          <button
            @click="selectJoinSession"
            class="w-full bg-indigo-600 text-white py-2 rounded-md"
          >
            Join Existing Session
          </button>
        </div>
      </div>

      <!-- Form for Creating New Session -->
      <div v-if="creatingSession" class="space-y-4">
        <h2 class="text-xl font-semibold text-center text-gray-100">
          Create New Session
        </h2>
        <form @submit.prevent="createSessionHandler" class="space-y-4">
          <div>
            <label for="displayName" class="block text-sm text-gray-300"
              >Display Name</label
            >
            <input
              v-model="displayName"
              id="displayName"
              type="text"
              class="w-full p-2 mt-2 bg-gray-700 text-gray-100 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-indigo-600 text-white py-2 rounded-md"
          >
            Create Session
          </button>
        </form>
      </div>

      <!-- Form for Joining Existing Session -->
      <div v-if="joiningSession" class="space-y-4">
        <h2 class="text-xl font-semibold text-center text-gray-100">
          Join Existing Session
        </h2>
        <form @submit.prevent="joinSessionHandler" class="space-y-4">
          <div>
            <label for="sessionId" class="block text-sm text-gray-300"
              >Session ID</label
            >
            <input
              v-model="sessionIdToJoin"
              id="sessionId"
              type="text"
              class="w-full p-2 mt-2 bg-gray-700 text-gray-100 rounded-md"
              required
            />
          </div>
          <div>
            <label for="joinDisplayName" class="block text-sm text-gray-300"
              >Display Name</label
            >
            <input
              v-model="joinDisplayName"
              id="joinDisplayName"
              type="text"
              class="w-full p-2 mt-2 bg-gray-700 text-gray-100 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-indigo-600 text-white py-2 rounded-md"
          >
            Join Session
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSupabase } from '@/composables/useSupabase';

const displayName = ref('');
const joinDisplayName = ref('');
const sessionIdToJoin = ref('');
const sessionId = ref('');
const creatingSession = ref(false);
const joiningSession = ref(false);
const router = useRouter();

const {
  createSession,
  joinSession,
  sessionId: currentSessionId,
} = useSupabase();

// Select Create New Session
const selectCreateSession = () => {
  creatingSession.value = true;
  joiningSession.value = false;
};

// Select Join Existing Session
const selectJoinSession = () => {
  creatingSession.value = false;
  joiningSession.value = true;
};

// Handle creating a session
const createSessionHandler = async () => {
  await createSession(displayName.value);
  sessionId.value = currentSessionId.value;

  // Redirect to Canvas with the session ID
  router.push({
    name: 'drawSession',
    query: { sessionId: sessionId.value, newSession: true },
  });
};

// Handle joining a session
const joinSessionHandler = async () => {
  await joinSession(sessionIdToJoin.value, joinDisplayName.value);
  sessionId.value = sessionIdToJoin.value;

  // Redirect to Canvas with the session ID
  router.push({
    name: 'drawSession',
    query: { sessionId: sessionId.value, newSession: false },
  });
};
</script>
