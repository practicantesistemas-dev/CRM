import { createApp } from 'vue'
import App from './App.vue'

import '@/app/styles/style.css'
import 'primeicons/primeicons.css'

import router from '@/app/router'
import { installPlugins } from '@/app/plugins'

const app = createApp(App)

installPlugins(app)
app.use(router)
app.mount('#app')
