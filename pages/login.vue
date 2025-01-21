<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 px-4 sm:px-6"
  >
    <div class="w-full max-w-md bg-gray-800 rounded-md shadow-md p-8">
      <h2 class="text-2xl sm:text-3xl font-bold mb-6 text-center">
        {{ isSignup ? 'Sign Up' : 'Login' }}
      </h2>

      <!-- Toggle between login and signup forms -->
      <form @submit.prevent="isSignup ? handleSignup() : handleLogin()">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="mt-1 block w-full bg-gray-700 border-gray-600 text-gray-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-1"
            required
          />
        </div>

        <div v-if="isSignup" class="mb-4">
          <label for="displayName" class="block text-sm font-medium"
            >Display Name</label
          >
          <input
            id="displayName"
            v-model="displayName"
            type="text"
            class="mt-1 block w-full bg-gray-700 border-gray-600 text-gray-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-1"
            required
          />
        </div>

        <div class="mb-4">
          <label for="password" class="block text-sm font-medium"
            >Password</label
          >
          <input
            id="password"
            v-model="password"
            type="password"
            class="mt-1 block w-full bg-gray-700 border-gray-600 text-gray-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-1"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          :disabled="store.loading"
        >
          {{ isSignup ? 'Sign Up' : 'Login' }}
        </button>

        <p v-if="store.error" class="mt-4 text-sm text-red-500">
          {{ store.error }}
        </p>
      </form>

      <!-- Toggle text to switch between login and signup -->
      <p class="mt-6 text-sm text-center">
        <span v-if="isSignup">
          Already have an account?
          <button
            @click="toggleForm"
            class="text-indigo-400 hover:text-indigo-500 focus:outline-none"
          >
            Login
          </button>
        </span>
        <span v-else>
          Don't have an account?
          <button
            @click="toggleForm"
            class="text-indigo-400 hover:text-indigo-500 focus:outline-none"
          >
            Sign Up
          </button>
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSessionStore } from '@/stores/session';

const email = ref('');
const displayName = ref('');
const password = ref('');
const isSignup = ref(false);
const store = useSessionStore();
const router = useRouter();

const toggleForm = () => {
  isSignup.value = !isSignup.value;
};

const handleLogin = async () => {
  await store.login(email.value, password.value);
  if (store.isAuthenticated) {
    router.push('/dashboard'); // Redirect to the dashboard
  }
};

const handleSignup = async () => {
  await store.register(email.value, password.value, displayName.value);
  if (store.isAuthenticated) {
    router.push('/dashboard'); // Redirect to the dashboard
  }
};
</script>
