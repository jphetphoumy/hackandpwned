// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  srr: false,
  css: ['~/assets/css/main.css'],
  modules: ["@nuxt/content"],
  content: {
    highlight: {
        theme: 'catppuccin-mocha',
        langs: ['python', 'bash']
    }
  },
})
