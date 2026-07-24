<script setup lang="ts">
import { LogOut } from 'lucide-vue-next'
import { menuGroups } from './menu.config'
import type { Vista, Tab } from './menu.config'

defineProps<{
  collapsed: boolean;
  vistaActiva: Vista;
  openTabs: Tab[];
}>()

const emit = defineEmits<{
  (e: 'navigate', item: Tab): void;
  (e: 'logout'): void;
}>()
</script>

<template>
  <aside
    class="flex flex-col shrink-0 overflow-hidden transition-all duration-300 z-20 bg-[#295FD3]"
    :style="{ width: collapsed ? '64px' : '224px' }"
  >
    <!-- Logo -->
    <div class="shrink-0 overflow-hidden">
      <div v-if="!collapsed" class="flex flex-col items-center justify-center py-5 px-4 gap-3">
        <div class="text-center">
          <div class="text-[10px] font-bold uppercase tracking-widest text-white/50 leading-none">Plataforma</div>
          <div class="text-[16px] font-black text-white tracking-wide mt-1">CRM Mercadeo</div>
        </div>
        <img src="/logo-liga-50.png" alt="La Liga" class="w-full object-contain select-none pointer-events-none max-h-[130px]" />
      </div>
      <div v-else class="flex items-center justify-center h-16 bg-white/10">
        <img src="/logo-liga-50.png" alt="La Liga" class="h-8 w-auto object-contain select-none pointer-events-none brightness-0 invert" />
      </div>
      <div class="h-px bg-white/10" />
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto py-3 scrollbar-none">
      <template v-for="group in menuGroups" :key="group.label ?? '__root__'">
        <div v-if="group.label && collapsed" class="px-3 py-2">
          <div class="h-px bg-white/15 rounded" />
        </div>
        
        <div v-if="group.label && !collapsed" class="px-4 pt-4 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-white select-none">
          {{ group.label }}
        </div>
        
        <button
          v-for="item in group.items"
          :key="item.key"
          @click="emit('navigate', item)"
          :title="collapsed ? item.label : undefined"
          class="flex items-center gap-3 rounded-lg mx-2 px-2 py-2 transition-all text-left w-[calc(100%-16px)] group/item cursor-pointer"
          :class="vistaActiva === item.key ? 'bg-white/20 text-white' : 'text-white hover:bg-white/10'"
        >
          <component :is="item.icono" :size="16" class="shrink-0 transition-colors" :class="vistaActiva === item.key ? 'text-white' : 'text-white/80'" />
          <span v-if="!collapsed" class="text-[12px] font-semibold truncate flex-1 !text-white">{{ item.label }}</span>
          
          <span v-if="vistaActiva === item.key && !collapsed" class="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
          <span v-else-if="openTabs.some(t => t.key === item.key) && !collapsed && vistaActiva !== item.key" class="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
        </button>
      </template>
    </nav>

    <!-- Logout -->
    <div class="shrink-0 border-t border-white/10 p-2">
      <button @click="emit('logout')" :title="collapsed ? 'Cerrar sesión' : undefined" class="flex items-center gap-3 w-full rounded-lg px-2 py-2 text-white/65 hover:bg-white/10 hover:text-white transition-all group/logout">
        <LogOut :size="15" class="shrink-0 group-hover/logout:text-white transition-colors" />
        <span v-if="!collapsed" class="text-[12px] font-semibold">Cerrar sesión</span>
      </button>
    </div>
  </aside>
</template>