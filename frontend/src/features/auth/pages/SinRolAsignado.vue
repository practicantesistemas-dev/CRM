<script setup lang="ts">
import { ShieldAlert } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { logout } = useAuth()

const cerrarSesion = () => {
  logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
    <div
      class="absolute inset-0 opacity-[0.07] pointer-events-none select-none"
      style="background-image: url('/logo-liga-50.png'); background-repeat: repeat; background-size: 180px auto;"
    ></div>

    <div class="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-8 text-center space-y-4 relative z-10">
      <div class="relative w-14 h-14 mx-auto flex items-center justify-center">
        <span class="absolute inset-0 rounded-2xl bg-amber-200/60 dark:bg-amber-500/20 animate-ping"></span>
        <div class="relative w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center">
          <ShieldAlert :size="28" class="text-amber-500" />
        </div>
      </div>
      <div class="space-y-1.5">
        <h1 class="text-[15px] font-bold text-slate-900 dark:text-slate-100">Sin rol en el CRM</h1>
        <p class="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
          Contacta con el administrador del sistema.
        </p>
      </div>
      <button
        @click="cerrarSesion"
        class="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-[12px] font-bold transition-all"
      >
        Cerrar sesión
      </button>
    </div>
  </div>
</template>
