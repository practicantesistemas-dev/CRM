import type { App } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

export function installPrimeVue(app: App) {
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        cssLayer: {
          name: 'primevue',
          order: 'tailwind-base, primevue, tailwind-utilities',
        },
      },
    },
  })
}
