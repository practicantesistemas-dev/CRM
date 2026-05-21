import { createApp } from 'vue'
import App from './App.vue'

import './style.css'

// 2. Importaciones de PrimeVue
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      // 💡 Consejo pro: Esto evita que PrimeVue use selectores con demasiada 
      // prioridad y permite que tus clases de Tailwind ganen fácilmente.
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue, tailwind-utilities'
      }
    }
  }
})

app.mount('#app')