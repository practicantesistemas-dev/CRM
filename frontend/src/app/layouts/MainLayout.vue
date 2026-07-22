<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/features/auth/composables/useAuth'

import {
  LayoutDashboard, Heart, Users, Building2, Truck,
  Target, GitBranch, Layers, SlidersHorizontal, Megaphone,
  BookOpen, Upload, Zap,
  ChevronLeft, ChevronRight, LogOut,
  RefreshCw, X
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const { me, logout, checkSession, fetchMe } = useAuth()

const initials = computed(() => {
  const parts = (me.value?.nombres ?? '').trim().split(/\s+/).filter(Boolean)
  const letters = parts.slice(0, 2).map((p) => p[0]).join('').toUpperCase()
  return letters || 'PL'
})

// Vigila el token mientras el usuario está inactivo en una ruta (sin navegar)
// para que, al expirar, se lo devuelva al login sin esperar a la próxima navegación.
let sessionWatcher: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  fetchMe()
  sessionWatcher = setInterval(() => {
    if (!checkSession()) {
      router.push('/login')
    }
  }, 30_000)
})
onUnmounted(() => {
  if (sessionWatcher) clearInterval(sessionWatcher)
})

type Vista =
  | 'dashboard' | 'plan-liga' | 'contactos' | 'empresas' | 'proveedores'
  | 'servicios' | 'oportunidades' | 'embudos' | 'segmentacion'
  | 'relacionamiento' | 'campanas' | 'importacion' | 'automatizaciones'

interface Tab { key: Vista; label: string; icono: any }

// ── Menu ──────────────────────────────────────────────────────────
interface MenuGroup { label?: string; items: Tab[] }

const menuGroups: MenuGroup[] = [
  { items: [
    { key: 'dashboard',        label: 'Dashboard',                 icono: LayoutDashboard },
  ]},
  { label: 'Plan Liga', items: [
    { key: 'plan-liga',       label: 'Titulares y Beneficiarios', icono: Heart           },
  ]},
  { label: 'Comercial', items: [
    { key: 'contactos',        label: 'Contactos',                 icono: Users           },
    { key: 'empresas',         label: 'Empresas',                  icono: Building2       },
    { key: 'proveedores',      label: 'Proveedores',               icono: Truck           },
    { key: 'oportunidades',    label: 'Oportunidades',             icono: Target          },
    { key: 'embudos',          label: 'Tablero',       icono: GitBranch       },
  ]},
  { label: 'Marketing', items: [
    { key: 'servicios',        label: 'Servicios',       icono: Layers          },
    { key: 'segmentacion',     label: 'Segmentación',              icono: SlidersHorizontal},
    { key: 'campanas',         label: 'Campañas Masivas',          icono: Megaphone       },
  ]},
  { label: 'Operaciones', items: [
    { key: 'relacionamiento',  label: 'Bitácora',                  icono: BookOpen        },
    { key: 'importacion',      label: 'Importación Masiva',        icono: Upload          },
    { key: 'automatizaciones', label: 'Automatizaciones',          icono: Zap             },
  ]},
]

// ── Tabs ──────────────────────────────────────────────────────────
const MAX_TABS = 4
const tabs         = ref<Tab[]>([])
const activeTabIdx = ref(0)
const vistaActiva  = computed<Vista>(() => tabs.value[activeTabIdx.value]?.key ?? 'dashboard')

const findMenuItem = (key: string): Tab | undefined => {
  for (const g of menuGroups) {
    const item = g.items.find(i => i.key === key)
    if (item) return item
  }
  return undefined
}

// Sincroniza las pestañas con la ruta activa (deep-linking / navegación directa por URL).
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

const navigateTo = (item: Tab) => {
  router.push('/' + item.key)
}

const goToTab = (idx: number) => {
  router.push('/' + tabs.value[idx].key)
}

const closeTab = (idx: number, e: MouseEvent) => {
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

const handleLogout = () => {
  logout()
  router.push('/login')
}

// ── Menú de usuario (avatar del header) ──────────────────────────
const menuUsuarioAbierto = ref(false)
const toggleMenuUsuario = () => { menuUsuarioAbierto.value = !menuUsuarioAbierto.value }
const cerrarMenuUsuarioAfuera = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.menu-usuario-trigger') && !target.closest('.menu-usuario-panel')) {
    menuUsuarioAbierto.value = false
  }
}
onMounted(() => document.addEventListener('click', cerrarMenuUsuarioAfuera))
onUnmounted(() => document.removeEventListener('click', cerrarMenuUsuarioAfuera))

// ── Misc ──────────────────────────────────────────────────────────
const sidebarCollapsed = ref(false)

const activeLabel = computed(() => {
  for (const g of menuGroups) {
    const f = g.items.find(i => i.key === vistaActiva.value)
    if (f) return f.label
  }
  return ''
})
const activeGroup = computed(() => {
  for (const g of menuGroups) {
    if (g.items.find(i => i.key === vistaActiva.value)) return g.label ?? 'General'
  }
  return ''
})
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-[#F8FAFC] font-[Inter,system-ui,sans-serif]">

    <!-- ═══════════════════════════════════════════════
         SIDEBAR  —  lighter royal blue
    ═══════════════════════════════════════════════ -->
    <aside
      class="flex flex-col shrink-0 overflow-hidden transition-all duration-300 z-20"
      style="background-color: #295FD3"
      :style="{ width: sidebarCollapsed ? '64px' : '224px' }"
    >
      <!-- Logo -->
      <div class="shrink-0 overflow-hidden">
        <!-- Expandido -->
        <div v-if="!sidebarCollapsed" class="flex flex-col items-center justify-center py-5 px-4 gap-3">
          <div class="text-center">
            <div class="text-[10px] font-bold uppercase tracking-widest text-white/50 leading-none">Plataforma</div>
            <div class="text-[16px] font-black text-white tracking-wide mt-1">CRM Mercadeo</div>
          </div>
          <img
            src="/logo-liga-50.png"
            alt="La Liga"
            class="w-full object-contain select-none pointer-events-none"
            style="max-height: 130px"
          />
        </div>
        <!-- Colapsado -->
        <div v-else class="flex items-center justify-center h-16 bg-white/10">
          <img
            src="/logo-liga-50.png"
            alt="La Liga"
            class="h-8 w-auto object-contain select-none pointer-events-none brightness-0 invert"
          />
        </div>
        <div class="h-px bg-white/10" />
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto py-3 scrollbar-none">
        <template v-for="group in menuGroups" :key="group.label ?? '__root__'">
          <!-- Divider for collapsed state -->
          <div v-if="group.label && sidebarCollapsed" class="px-3 py-2">
            <div class="h-px bg-white/15 rounded" />
          </div>
          <!-- Section label -->
          <div
            v-if="group.label && !sidebarCollapsed"
            class="px-4 pt-4 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-white opacity-100 select-none"
          >
            {{ group.label }}
          </div>
          <!-- Items -->
          <button
            v-for="item in group.items"
            :key="item.key"
            @click="navigateTo(item)"
            :title="sidebarCollapsed ? item.label : undefined"
            class="flex items-center gap-3 rounded-lg mx-2 px-2 py-2 transition-all text-left w-[calc(100%-16px)] group/item"
            :class="vistaActiva === item.key
          ? 'bg-white/20 text-white'
          : 'text-white hover:text-white hover:bg-white/10'"
          >
            <component
              :is="item.icono"
              :size="16"
              class="shrink-0 transition-colors"
              :class="vistaActiva === item.key ? 'text-white' : 'text-white/80'"
            />
            <span
              v-if="!sidebarCollapsed"
              class="text-[12px] font-semibold truncate flex-1 !text-white"
            >
              {{ item.label }}
            </span>
            <!-- Active dot -->
            <span
              v-if="vistaActiva === item.key && !sidebarCollapsed"
              class="w-1.5 h-1.5 rounded-full bg-white shrink-0"
            />
            <!-- Tab indicator: small badge showing it's open in a tab -->
            <span
              v-else-if="tabs.some(t => t.key === item.key) && !sidebarCollapsed && vistaActiva !== item.key"
              class="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0"
            />
          </button>
        </template>
      </nav>

      <!-- Logout -->
      <div class="shrink-0 border-t border-white/10 p-2">
        <button
          @click="handleLogout"
          :title="sidebarCollapsed ? 'Cerrar sesión' : undefined"
          class="flex items-center gap-3 w-full rounded-lg px-2 py-2 text-white/65 hover:bg-white/10 hover:text-white transition-all group/logout"
        >
          <LogOut :size="15" class="shrink-0 group-hover/logout:text-white transition-colors" />
          <span v-if="!sidebarCollapsed" class="text-[12px] font-semibold">Cerrar sesión</span>
        </button>
      </div>
    </aside>

    <!-- ═══════════════════════════════════════════════
         MAIN AREA
    ═══════════════════════════════════════════════ -->
    <div class="flex-1 flex flex-col overflow-hidden min-w-0">

      <!-- ── Top header ────────────────────────────────────────── -->
      <header class="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 gap-3 z-10">
        <div class="flex items-center gap-3 min-w-0">
          <!-- Toggle sidebar -->
          <button
            @click="sidebarCollapsed = !sidebarCollapsed"
            class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all shrink-0"
          >
            <component :is="sidebarCollapsed ? ChevronRight : ChevronLeft" :size="15" />
          </button>
          <!-- Breadcrumb -->
          <div class="flex items-center gap-1.5 text-[12px] min-w-0 overflow-hidden">
            <span class="text-slate-400 shrink-0">CRM Mercadeo</span>
            <template v-if="activeGroup && activeGroup !== 'General'">
              <span class="text-slate-300 shrink-0 hidden sm:inline">/</span>
              <span class="text-slate-400 shrink-0 hidden sm:inline">{{ activeGroup }}</span>
            </template>
            <span class="text-slate-300 shrink-0">/</span>
            <span class="font-bold text-[#0F172A] truncate">{{ activeLabel }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button class="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all" title="Actualizar">
            <RefreshCw :size="13" />
          </button>
          <div class="relative">
            <button
              type="button"
              @click="toggleMenuUsuario"
              class="menu-usuario-trigger flex items-center gap-2 pl-2 border-l border-slate-200 rounded-lg hover:bg-slate-50 transition-all py-1 pr-1"
            >
              <div class="text-right hidden sm:block leading-tight">
                <div class="text-[23px] font-bold text-[#0F172A] whitespace-nowrap">{{ me?.nombres ?? '—' }}</div>
                <div class="text-[21px] text-slate-400 font-bold uppercase tracking-wider">{{ me?.portal_role ?? '' }}</div>
              </div>
              <div
                class="h-8 w-8 rounded-lg bg-[#1E3A8A] text-white text-[10px] font-bold flex items-center justify-center select-none shrink-0"
                :title="me?.nombres"
              >
                {{ initials }}
              </div>
            </button>

            <div
              v-if="menuUsuarioAbierto"
              class="menu-usuario-panel absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 z-30"
            >
              <button
                @click="menuUsuarioAbierto = false; handleLogout()"
                class="flex items-center gap-2 w-full px-3 py-2 text-[12px] font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <LogOut :size="14" class="shrink-0" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- ── Tab strip ─────────────────────────────────────────── -->
      <div class="bg-white border-b border-slate-200 px-3 flex items-end gap-0.5 shrink-0 overflow-x-auto">
        <button
          v-for="(tab, idx) in tabs"
          :key="tab.key"
          @click="goToTab(idx)"
          class="flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-semibold border-b-2 transition-all shrink-0 group/tab rounded-t-lg hover:bg-slate-50"
          :class="idx === activeTabIdx
            ? 'border-[#1E3A8A] text-[#1E3A8A] bg-[#EEF2FF]/60'
            : 'border-transparent text-slate-500 hover:text-slate-700'"
        >
          <component :is="tab.icono" :size="12" class="shrink-0" />
          <span class="max-w-[120px] truncate">{{ tab.label }}</span>
          <span
            v-if="tabs.length > 1"
            class="w-4 h-4 rounded flex items-center justify-center ml-0.5 opacity-0 group-hover/tab:opacity-100 hover:!bg-slate-200 transition-all"
            :class="idx === activeTabIdx ? 'text-[#1E3A8A] hover:bg-[#DBEAFE]' : 'text-slate-400 hover:bg-slate-100'"
            @click.stop="closeTab(idx, $event)"
          >
            <X :size="9" />
          </span>
        </button>
        <!-- Slot count indicator when at max -->
        <div
          v-if="tabs.length >= MAX_TABS"
          class="ml-auto px-2 py-2 text-[10px] text-slate-400 font-semibold shrink-0 self-center"
        >
          {{ MAX_TABS }}/{{ MAX_TABS }} pestañas
        </div>
      </div>

      <!-- ── Content ───────────────────────────────────────────── -->
      <main
        class="flex-1 min-h-0 overflow-y-auto p-6"
      >
        <router-view />
      </main>
    </div>
  </div>
</template>
