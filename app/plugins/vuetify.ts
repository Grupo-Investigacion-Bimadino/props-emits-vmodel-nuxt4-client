// app/plugins/vuetify.ts
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#044bafff', // Coral Pink
            secondary: '#4D96FF', // Sky Blue
            accent: '#6BCB77', // Mint Green
            background: '#F8FAFC',
            surface: '#FFFFFF',
            'surface-variant': '#F1F5F9',
            error: '#FF6B6B',
            info: '#4D96FF',
            success: '#6BCB77',
            warning: '#FFD93D',
          },
        },
      },
    },
    defaults: {
      VBtn: { rounded: 'pill', elevation: 0 },
      VCard: { rounded: 'xl', elevation: 2 },
    },
  })
  app.vueApp.use(vuetify)
})
