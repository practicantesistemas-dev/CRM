<script setup lang="ts">
import { Mail, Phone, Edit2 } from 'lucide-vue-next'
import type { Proveedor } from '../types/proveedor'
import { categoriaColor } from '../constants/proveedores.constants'

defineProps<{ rows: Proveedor[] }>()
const emit = defineEmits<{ editar: [p: Proveedor] }>()
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[820px]">
        <thead class="bg-[#F8FAFC] border-b border-slate-200">
          <tr>
            <th class="text-left px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Proveedor</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Categoría</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">NIT</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Correo</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Teléfono</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estado</th>
            <th class="text-right px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="p in rows" :key="p.id" class="hover:bg-slate-50/60 transition-colors group">
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-[#D1FAE5] text-[#059669] font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                  {{ p.nombre.split(' ').map(w => w[0]).slice(0, 2).join('') }}
                </div>
                <span class="text-[12px] font-semibold text-[#0F172A]">{{ p.nombre }}</span>
              </div>
            </td>
            <td class="px-4 py-3.5">
              <span class="text-[11px] font-semibold" :class="categoriaColor(p.categoria)">{{ p.categoria }}</span>
            </td>
            <td class="px-4 py-3.5 text-[11px] text-slate-600 font-medium">{{ p.nit }}</td>
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-1 text-[11px] text-slate-600"><Mail :size="10" class="text-slate-400" />{{ p.correo }}</div>
            </td>
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-1 text-[11px] text-slate-600"><Phone :size="10" class="text-slate-400" />{{ p.telefono }}</div>
            </td>
            <td class="px-4 py-3.5">
              <span class="text-[11px] font-semibold" :class="p.estado === 'Activo' ? 'text-emerald-600' : 'text-slate-400'">{{ p.estado }}</span>
            </td>
            <td class="px-5 py-3.5 text-right">
              <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="emit('editar', p)" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#2447F9] text-slate-500 flex items-center justify-center transition-all" title="Editar">
                  <Edit2 :size="12" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="rows.length === 0">
            <td colspan="7" class="text-center py-16 text-slate-400 text-[12px]">No se encontraron proveedores.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
