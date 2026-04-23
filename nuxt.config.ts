import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // ✅ Pinia 3 + persistedstate para Nuxt 4
  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
  ],

  build: {
    transpile: ['vuetify'],
  },

  // ✅ Vuetify: patrón actualizado de code-nuxt-4 (vite.plugins directo)
  vite: {
    plugins: [
      vuetify({ autoImport: true }),
    ],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  css: [
    '~/assets/css/main.css',
    '@mdi/font/css/materialdesignicons.css',
  ],

  // ✅ apiBase PRIVADO: solo accessible en server/api/ (Nitro BFF)
  // El cliente nunca llama directamente a JSON Server
  runtimeConfig: {
    apiBase: process.env.API_BASE || 'http://localhost:3001',
    public: {
      // no exponer apiBase al cliente
    },
  },
})
