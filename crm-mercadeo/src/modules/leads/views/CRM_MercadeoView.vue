<script setup lang="ts">
import { ref, computed } from 'vue'

import ModuloGeneral           from '../components/modulo_general.vue'
import PlanLiga                from '../components/plan_liga.vue'
import Contactos               from '../components/contactos.vue'
import Empresas                from '../components/empresas.vue'
import Proveedores             from '../components/proveedores.vue'
import ServiciosPlanLiga       from '../components/servicios_plan_liga.vue'
import Oportunidades           from '../components/oportunidades.vue'
import Embudos                 from '../components/embudos.vue'
import Segmentacion            from '../components/segmentacion.vue'
import BitacoraRelacionamiento from '../components/bitacora_relacionamiento.vue'
import Campanas                from '../components/campanas.vue'
import ImportacionMasiva       from '../components/importacion_masiva.vue'
import Automatizaciones        from '../components/automatizaciones.vue'

import {
  LayoutDashboard, Heart, Users, Building2, Truck,
  Target, GitBranch, Layers, SlidersHorizontal, Megaphone,
  BookOpen, Upload, Zap,
  ChevronLeft, ChevronRight, LogOut, Bell,
  RefreshCw, X
} from 'lucide-vue-next'

defineEmits(['logout'])

type Vista =
  | 'dashboard' | 'plan_liga' | 'contactos' | 'empresas' | 'proveedores'
  | 'servicios' | 'oportunidades' | 'embudos' | 'segmentacion'
  | 'bitacora' | 'campanas' | 'importacion' | 'automatizaciones'

// ── Tabs ──────────────────────────────────────────────────────────
interface Tab { key: Vista; label: string; icono: any }

const MAX_TABS = 4
const tabs         = ref<Tab[]>([{ key: 'dashboard', label: 'Dashboard', icono: LayoutDashboard }])
const activeTabIdx = ref(0)
const vistaActiva  = computed<Vista>(() => tabs.value[activeTabIdx.value]?.key ?? 'dashboard')

const navigateTo = (item: Tab) => {
  const idx = tabs.value.findIndex(t => t.key === item.key)
  if (idx !== -1) { activeTabIdx.value = idx; return }
  if (tabs.value.length < MAX_TABS) {
    tabs.value.push({ key: item.key, label: item.label, icono: item.icono })
    activeTabIdx.value = tabs.value.length - 1
  } else {
    const replaceIdx = tabs.value.findIndex((_, i) => i !== activeTabIdx.value)
    if (replaceIdx !== -1) {
      tabs.value.splice(replaceIdx, 1, { key: item.key, label: item.label, icono: item.icono })
      activeTabIdx.value = replaceIdx
    }
  }
}

const closeTab = (idx: number, e: MouseEvent) => {
  e.stopPropagation()
  if (tabs.value.length === 1) return
  tabs.value.splice(idx, 1)
  if (activeTabIdx.value >= tabs.value.length) activeTabIdx.value = tabs.value.length - 1
  else if (idx < activeTabIdx.value)          activeTabIdx.value -= 1
}

// ── Misc ──────────────────────────────────────────────────────────
const sidebarCollapsed = ref(false)
const periodo          = ref('30d')

// ── Menu ──────────────────────────────────────────────────────────
interface MenuGroup { label?: string; items: Tab[] }

const menuGroups: MenuGroup[] = [
  { items: [
    { key: 'dashboard',        label: 'Dashboard',                 icono: LayoutDashboard },
  ]},
  { label: 'Plan Liga', items: [
    { key: 'plan_liga',        label: 'Titulares y Beneficiarios', icono: Heart           },
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
    { key: 'bitacora',         label: 'Bitácora',                  icono: BookOpen        },
    { key: 'importacion',      label: 'Importación Masiva',        icono: Upload          },
    { key: 'automatizaciones', label: 'Automatizaciones',          icono: Zap             },
  ]},
]

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
          @click="$emit('logout')"
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
          <select
            v-model="periodo"
            class="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer hidden sm:block"
          >
            <option value="7d">Últ. 7 días</option>
            <option value="30d">Últ. 30 días</option>
            <option value="90d">Este trimestre</option>
            <option value="year">Este año</option>
          </select>
          <button class="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all" title="Actualizar">
            <RefreshCw :size="13" />
          </button>
          <button class="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all relative">
            <Bell :size="14" />
            <span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#EC4899]" />
          </button>
          <div class="h-8 w-8 rounded-lg bg-[#1E3A8A] text-white text-[10px] font-bold flex items-center justify-center select-none">
            PL
          </div>
        </div>
      </header>

      <!-- ── Tab strip ─────────────────────────────────────────── -->
      <div class="bg-white border-b border-slate-200 px-3 flex items-end gap-0.5 shrink-0 overflow-x-auto">
        <button
          v-for="(tab, idx) in tabs"
          :key="tab.key"
          @click="activeTabIdx = idx"
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
        <ModuloGeneral             v-if="vistaActiva === 'dashboard'"            />
        <PlanLiga                  v-else-if="vistaActiva === 'plan_liga'"       />
        <Contactos                 v-else-if="vistaActiva === 'contactos'"       />
        <Empresas                  v-else-if="vistaActiva === 'empresas'"        />
        <Proveedores               v-else-if="vistaActiva === 'proveedores'"     />
        <Oportunidades             v-else-if="vistaActiva === 'oportunidades'"   />
        <Embudos                   v-else-if="vistaActiva === 'embudos'"         />
        <ServiciosPlanLiga         v-else-if="vistaActiva === 'servicios'"       />
        <Segmentacion              v-else-if="vistaActiva === 'segmentacion'"    />
        <Campanas                  v-else-if="vistaActiva === 'campanas'"        />
        <BitacoraRelacionamiento   v-else-if="vistaActiva === 'bitacora'"        />
        <ImportacionMasiva         v-else-if="vistaActiva === 'importacion'"     />
        <Automatizaciones          v-else-if="vistaActiva === 'automatizaciones'"/>
      </main>
    </div>
  </div>
</template>
