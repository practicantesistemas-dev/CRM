<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight, RefreshCw, LogOut } from 'lucide-vue-next'

defineProps<{
    collapsed: boolean;
    activeGroup: string;
    activeLabel: string;
    userName: string;
    userRole: string;
    userInitials: string;
}>()

const emit = defineEmits<{
    (e: 'toggleSidebar'): void;
    (e: 'logout'): void;
}>()

const menuAbierto = ref(false)

const cerrarMenu = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('.menu-usuario-trigger') && !target.closest('.menu-usuario-panel')) {
        menuAbierto.value = false
    }
}

const isRefreshing = ref(false)

const recargarPagina = () => {
  isRefreshing.value = true 
  
  setTimeout(() => {
    window.location.reload()
  }, 500) 
}

    onMounted(() => document.addEventListener('click', cerrarMenu))
    onUnmounted(() => document.removeEventListener('click', cerrarMenu))
</script>

<template>
    <header class="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 gap-3 z-10">
        <div class="flex items-center gap-3 min-w-0">
            <button @click="emit('toggleSidebar')"
                class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all shrink-0 cursor-pointer">
                <component :is="collapsed ? ChevronRight : ChevronLeft" :size="15" />
            </button>

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

        <div class="flex items-center gap-2 shrink-0 relative">
            <button @click="recargarPagina" :disabled="isRefreshing"
                class="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-wait"
                title="Actualizar">
                <RefreshCw :size="13" :class="{ 'animate-spin': isRefreshing }" />
            </button>

            <button @click="menuAbierto = !menuAbierto"
                class="menu-usuario-trigger flex items-center gap-2 pl-2 border-l border-slate-200 rounded-lg hover:bg-slate-50 transition-all py-1 pr-1 cursor-pointer">
                <div class="text-right hidden sm:block leading-tight">
                    <div class="text-[23px] font-bold text-[#0F172A] whitespace-nowrap">{{ userName }}</div>
                    <div class="text-[21px] text-slate-400 font-bold uppercase tracking-wider">{{ userRole }}</div>
                </div>
                <div
                    class="h-8 w-8 rounded-lg bg-[#1E3A8A] text-white text-[10px] font-bold flex items-center justify-center select-none shrink-0">
                    {{ userInitials }}
                </div>
            </button>

            <div v-if="menuAbierto"
                class="menu-usuario-panel absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 z-30">
                <button @click="menuAbierto = false; emit('logout')"
                    class="flex items-center gap-2 w-full px-3 py-2 text-[12px] font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer">
                    <LogOut :size="14" class="shrink-0" />
                    Cerrar sesión
                </button>
            </div>
        </div>
    </header>
</template>