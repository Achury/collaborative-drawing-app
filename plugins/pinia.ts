// plugins/pinia.ts
import { defineNuxtPlugin } from '#app';
import { createPinia } from 'pinia';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createPinia()); // Ensures Pinia is available globally
});
