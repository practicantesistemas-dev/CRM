<script setup lang="ts">
import { Mail, Phone, Edit2, Trash2, Wrench } from 'lucide-vue-next'
import type { Proveedor } from '../types/proveedor'
import { categoriaColor } from '../constants/proveedores.constants'

defineProps<{ rows: Proveedor[]; puedeGestionar: boolean; puedeEliminar: boolean }>()
const emit = defineEmits<{ editar: [p: Proveedor]; borrar: [p: Proveedor]; servicios: [p: Proveedor] }>()
</script>

<template>
  <div class="surface-card rounded-2xl shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[820px]">
        <thead class="surface-header border-b border-default">
          <tr>
            <th class="text-left px-5 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Proveedor</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Categoría</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">NIT</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Correo</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Teléfono</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Estado</th>
            <th class="text-right px-5 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
          <tr v-for="p in rows" :key="p.id" class="surface-hover transition-colors group">
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-[#D1FAE5] dark:bg-emerald-950/50 text-[#059669] dark:text-emerald-400 font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                  {{ p.nombre.split(' ').map(w => w[0]).slice(0, 2).join('') }}
                </div>
                <span class="text-[12px] font-semibold text-heading">{{ p.nombre }}</span>
              </div>
            </td>
            <td class="px-4 py-3.5">
              <span class="text-[11px] font-semibold" :class="categoriaColor(p.categoria)">{{ p.categoria }}</span>
            </td>
            <td class="px-4 py-3.5 text-[11px] text-body font-medium">{{ p.nit }}</td>
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-1 text-[11px] text-body"><Mail :size="10" class="text-slate-400 dark:text-slate-500" />{{ p.correo }}</div>
            </td>
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-1 text-[11px] text-body"><Phone :size="10" class="text-slate-400 dark:text-slate-500" />{{ p.telefono }}</div>
            </td>
            <td class="px-4 py-3.5">
              <span class="text-[11px] font-semibold" :class="p.estado === 'Activo' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'">{{ p.estado }}</span>
            </td>
            <td class="px-5 py-3.5 text-right">
              <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="emit('servicios', p)" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 dark:hover:text-emerald-400 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all" title="Actividades">
                  <Wrench :size="12" />
                </button>
                <button v-if="puedeGestionar" @click="emit('editar', p)" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-[#EEF2FF] dark:hover:bg-blue-950/50 hover:text-[#2447F9] dark:hover:text-blue-400 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all" title="Editar">
                  <Edit2 :size="12" />
                </button>
                <button v-if="puedeEliminar" @click="emit('borrar', p)" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 dark:hover:text-red-400 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all" title="Eliminar">
                  <Trash2 :size="12" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="rows.length === 0">
            <td colspan="7" class="text-center py-16 text-muted text-[12px]">No se encontraron proveedores.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
