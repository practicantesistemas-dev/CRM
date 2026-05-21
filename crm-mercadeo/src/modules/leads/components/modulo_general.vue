<script setup lang="ts">
import { ref } from 'vue'

// --- ESTADOS INTERNOS DEL MÓDULO GENERAL ---
const subVistaActiva = ref<'automatizaciones' | 'servicios'>('automatizaciones')
</script>

<template>
  <div class="flex-1 flex flex-col p-5 bg-white">
    <div class="flex border-b border-slate-200 bg-slate-50/50 p-1 rounded-lg shrink-0 gap-1 max-w-md">
      <button 
        @click="subVistaActiva = 'automatizaciones'" 
        :class="['flex-1 px-4 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all rounded-md cursor-pointer text-center', subVistaActiva === 'automatizaciones' ? 'bg-white text-blue-800 shadow-2xs border border-slate-200/40' : 'text-slate-400 hover:text-slate-600']"
      >
        Workflows & Secuencias
      </button>
      <button 
        @click="subVistaActiva = 'servicios'" 
        :class="['flex-1 px-4 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all rounded-md cursor-pointer text-center', subVistaActiva === 'servicios' ? 'bg-white text-blue-800 shadow-2xs border border-slate-200/40' : 'text-slate-400 hover:text-slate-600']"
      >
        Servicios Usados (Canal)
      </button>
    </div>

    <div class="mt-4 flex-1">
      
      <div v-if="subVistaActiva === 'automatizaciones'" class="space-y-4 animate-fadeIn">
        <div class="p-5 bg-slate-50 rounded-xl border border-slate-200/60 max-w-2xl">
          <span class="font-black text-slate-900 text-xs block tracking-wide uppercase text-blue-900">
            Secuencias Automatizadas
          </span>
          <p class="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
            Flujos estructurados del sistema según el estado del embudo comercial (Plan Liga Automation).
          </p>
          <div class="mt-4 flex flex-wrap items-center gap-2">
            <span class="px-2.5 py-1 bg-pink-50 text-pink-700 border border-pink-200 text-[10px] font-bold rounded-md uppercase tracking-wider">
              Trigger: Formulario Web
            </span>
            <span class="text-slate-400 text-xs font-bold">➔</span>
            <span class="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold rounded-md uppercase tracking-wider">
              Acción: Notificación WhatsApp
            </span>
          </div>
        </div>
      </div>

      <div v-if="subVistaActiva === 'servicios'" class="space-y-4 animate-fadeIn max-w-3xl">
        <div class="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 text-slate-500 font-black uppercase text-[9px] border-b border-slate-200 tracking-wider">
                <th class="p-3.5 pl-5">Línea de Servicio Institucional</th>
                <th class="p-3.5 pr-5 text-right">Incidencia Global</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700 font-semibold">
              <tr class="hover:bg-slate-50/60 transition-colors">
                <td class="p-3.5 pl-5 font-bold text-slate-900">Diseño de Sonrisa Mockup</td>
                <td class="p-3.5 pr-5 text-right">
                  <span class="px-2.5 py-0.5 bg-pink-50 text-pink-700 border border-pink-200 rounded-full text-[9px] font-black uppercase tracking-wider">
                    Alta Demanda
                  </span>
                </td>
              </tr>
              <tr class="hover:bg-slate-50/60 transition-colors">
                <td class="p-3.5 pl-5 font-bold text-slate-900">Profilaxis de Entrada</td>
                <td class="p-3.5 pr-5 text-right">
                  <span class="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[9px] font-black uppercase tracking-wider">
                    Frecuente
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-fadeIn { animation: fadeIn 0.15s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(1px); } to { opacity: 1; transform: translateY(0); } }
</style>