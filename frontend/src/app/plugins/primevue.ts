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
    // Los diálogos de la app usan z-[99999] o z-[999999] (Tailwind, ej. BeneficiarioFormDialog
    // y ReemplazarPersonaDialog se abren encima de un drawer y por eso usan el más alto). Los
    // overlays de PrimeVue (panel del Select, calendario del DatePicker) se abren con
    // appendTo="body" por defecto y su propio z-index (~1000), que quedaba por debajo del modal
    // más alto de la app y los dejaba invisibles detrás de él.
    zIndex: { modal: 2000000, overlay: 2000000, menu: 2000000, tooltip: 2001000 },
  })
}
