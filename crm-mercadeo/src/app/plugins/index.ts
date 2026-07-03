import type { App } from 'vue'
import { installPrimeVue } from './primevue'
import { installAntd } from './antd'

export function installPlugins(app: App) {
  installPrimeVue(app)
  installAntd(app)
}
