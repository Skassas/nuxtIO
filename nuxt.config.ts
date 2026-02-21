export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: ['@nuxtjs/tailwindcss'],

  runtimeConfig: {
    pocketbaseAdminEmail: process.env.POCKETBASE_ADMIN_EMAIL,
    pocketbaseAdminPassword: process.env.POCKETBASE_ADMIN_PASSWORD,
    public: {
      deleteButtonDuration: 4000,
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'tr' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      title: 'NuxtIO Admin',
    },
  },

  routeRules: {
    '/admin/**': { ssr: false },
    '/login': { ssr: false },
    '/install': { ssr: false },
  },
})
