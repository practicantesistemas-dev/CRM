<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/features/auth/composables/useAuth'

import Sidebar from './Components/Sidebar.vue'
import TopHeader from './Components/Header.vue'
import TabStrip from './Components/TabStrip.vue'
import { menuGroups, findMenuItem, MAX_TABS } from './Components/menu.config'
import type { Vista, Tab } from './Components/menu.config'

const router = useRouter()
const route = useRoute()
const { me, logout, checkSession, fetchMe } = useAuth()

const sidebarCollapsed = ref(false)
const tabs = ref<Tab[]>([])
const activeTabIdx = ref(0)

const vistaActiva = computed<Vista>(() => tabs.value[activeTabIdx.value]?.key ?? 'dashboard')

const initials = computed(() => {
  const parts = (me.value?.nombres ?? '').trim().split(/\s+/).filter(Boolean)
  const letters = parts.slice(0, 2).map((p) => p[0]).join('').toUpperCase()
  return letters || 'PL'
})

const activeLabel = computed(() => findMenuItem(vistaActiva.value)?.label ?? '')
const activeGroup = computed(() => {
  for (const g of menuGroups) {
    if (g.items.find(i => i.key === vistaActiva.value)) return g.label ?? 'General'
  }
  return ''
})

let sessionWatcher: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  fetchMe()
  sessionWatcher = setInterval(() => {
    if (!checkSession()) router.push('/login')
  }, 30_000)
})
onUnmounted(() => {
  if (sessionWatcher) clearInterval(sessionWatcher)
})

watch(() => route.path, (path) => {
  const key = (path.replace(/^\//, '') || 'dashboard') as Vista
  const idx = tabs.value.findIndex(t => t.key === key)
  if (idx !== -1) { activeTabIdx.value = idx; return }

  const item = findMenuItem(key)
  if (!item) return

  if (tabs.value.length < MAX_TABS) {
    tabs.value.push(item)
    activeTabIdx.value = tabs.value.length - 1
  } else {
    const replaceIdx = tabs.value.findIndex((_, i) => i !== activeTabIdx.value)
    if (replaceIdx !== -1) {
      tabs.value.splice(replaceIdx, 1, item)
      activeTabIdx.value = replaceIdx
    }
  }
}, { immediate: true })

// Acciones 
const handleNavigate = (item: Tab) => router.push('/' + item.key)
const handleGoToTab = (idx: number) => router.push('/' + tabs.value[idx].key)
const handleLogout = () => {
  logout()
  router.push('/login')
}

const handleCloseTab = (idx: number, e: MouseEvent) => {
  e.stopPropagation()
  if (tabs.value.length === 1) return
  const wasActive = idx === activeTabIdx.value
  tabs.value.splice(idx, 1)
  if (wasActive) {
    const nextIdx = Math.min(idx, tabs.value.length - 1)
    router.push('/' + tabs.value[nextIdx].key)
  } else if (idx < activeTabIdx.value) {
    activeTabIdx.value -= 1
  }
}
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-[#F8FAFC] font-[Inter,system-ui,sans-serif]">
    
    <Sidebar 
      :collapsed="sidebarCollapsed" 
      :vista-activa="vistaActiva"
      :open-tabs="tabs"
      @navigate="handleNavigate"
      @logout="handleLogout"
    />

    <div class="flex-1 flex flex-col overflow-hidden min-w-0">
      
      <TopHeader 
        :collapsed="sidebarCollapsed"
        :active-group="activeGroup"
        :active-label="activeLabel"
        :user-name="me?.nombres ?? '—'"
        :user-role="me?.portal_role ?? ''"
        :user-initials="initials"
        @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
        @logout="handleLogout"
      />

      <TabStrip 
        :tabs="tabs"
        :active-idx="activeTabIdx"
        :max-tabs="MAX_TABS"
        @go-to="handleGoToTab"
        @close="handleCloseTab"
      />

      <main class="flex-1 min-h-0 overflow-y-auto p-6">
        <router-view />
      </main>
      
    </div>
  </div>
</template>