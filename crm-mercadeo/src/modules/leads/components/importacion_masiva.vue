<script setup lang="ts">
import { ref } from 'vue'
import {
  Upload, FileText, CheckCircle, AlertCircle, XCircle,
  Download, RefreshCw, Clock, ChevronRight
} from 'lucide-vue-next'

interface RegistroImportacion {
  id: number
  archivo: string
  tipo: 'Excel' | 'CSV'
  fecha: string
  registros: number
  exitosos: number
  duplicados: number
  errores: number
  estado: 'Completado' | 'Con errores' | 'En proceso'
}

const historial = ref<RegistroImportacion[]>([
  { id: 1, archivo: 'contactos_junio_2026.xlsx', tipo: 'Excel', fecha: '2026-06-25', registros: 248, exitosos: 231, duplicados: 12, errores: 5, estado: 'Con errores' },
  { id: 2, archivo: 'empresas_bogota.csv', tipo: 'CSV', fecha: '2026-06-18', registros: 56, exitosos: 54, duplicados: 2, errores: 0, estado: 'Completado' },
  { id: 3, archivo: 'prospectos_mayo.xlsx', tipo: 'Excel', fecha: '2026-05-30', registros: 312, exitosos: 298, duplicados: 14, errores: 0, estado: 'Completado' },
  { id: 4, archivo: 'contactos_cali_q2.csv', tipo: 'CSV', fecha: '2026-05-15', registros: 89, exitosos: 81, duplicados: 6, errores: 2, estado: 'Con errores' },
])

const dragOver = ref(false)
const archivoSeleccionado = ref<File | null>(null)
const procesando = ref(false)
const resultadoVisible = ref(false)
const resultadoMock = ref({ registros: 0, exitosos: 0, duplicados: 0, errores: 0 })
const tipoImportacion = ref<'contactos' | 'empresas' | 'proveedores'>('contactos')

const onDrop = (e: DragEvent) => {
  dragOver.value = false
  const file = e.dataTransfer?.files[0]
  if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.csv'))) {
    archivoSeleccionado.value = file
  }
}

const onFileInput = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) archivoSeleccionado.value = file
}

const procesarArchivo = () => {
  if (!archivoSeleccionado.value) return
  procesando.value = true
  setTimeout(() => {
    const total = Math.floor(Math.random() * 200) + 50
    const dup = Math.floor(total * 0.05)
    const err = Math.floor(total * 0.02)
    resultadoMock.value = { registros: total, exitosos: total - dup - err, duplicados: dup, errores: err }
    historial.value.unshift({
      id: Date.now(),
      archivo: archivoSeleccionado.value!.name,
      tipo: archivoSeleccionado.value!.name.endsWith('.csv') ? 'CSV' : 'Excel',
      fecha: new Date().toISOString().split('T')[0],
      ...resultadoMock.value,
      estado: err > 0 ? 'Con errores' : 'Completado',
    })
    procesando.value = false
    resultadoVisible.value = true
  }, 1800)
}

const limpiar = () => {
  archivoSeleccionado.value = null
  resultadoVisible.value = false
  procesando.value = false
}

const estadoStyle = (e: string) => {
  if (e === 'Completado') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (e === 'Con errores') return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-[#EEF2FF] text-[#2447F9] border-blue-200'
}

const downloadPlantilla = (tipo: string) => {
  alert(`Descargando plantilla ${tipo}...`)
}
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-[#0F172A]">Importación Masiva</h2>
        <p class="text-[12px] text-slate-500 mt-0.5">Carga contactos, empresas o proveedores desde Excel o CSV</p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="downloadPlantilla('Contactos')" class="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Download :size="13" /> Plantilla Excel
        </button>
        <button @click="downloadPlantilla('CSV')" class="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Download :size="13" /> Plantilla CSV
        </button>
      </div>
    </div>

    <!-- Panel carga -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <h3 class="text-[13px] font-bold text-[#0F172A] mb-4">Cargar archivo</h3>

      <!-- Tipo de importación -->
      <div class="flex gap-2 mb-5">
        <button v-for="t in (['contactos', 'empresas', 'proveedores'] as const)" :key="t" @click="tipoImportacion = t" class="flex-1 h-9 rounded-xl text-[11px] font-bold transition-all capitalize" :class="tipoImportacion === t ? 'bg-[#2447F9] text-white shadow' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'">
          {{ t }}
        </button>
      </div>

      <!-- Drop zone -->
      <div
        class="border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer"
        :class="dragOver ? 'border-[#2447F9] bg-[#EEF2FF]' : archivoSeleccionado ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 hover:border-[#2447F9] hover:bg-[#EEF2FF]/30'"
        @dragover.prevent="dragOver = true"
        @dragleave="dragOver = false"
        @drop.prevent="onDrop"
        @click="($refs.fileInput as HTMLInputElement).click()"
      >
        <input ref="fileInput" type="file" accept=".xlsx,.csv" class="hidden" @change="onFileInput" />

        <div v-if="!archivoSeleccionado">
          <div class="w-14 h-14 rounded-2xl bg-[#EEF2FF] flex items-center justify-center mx-auto mb-4">
            <Upload :size="24" class="text-[#2447F9]" />
          </div>
          <p class="text-[13px] font-bold text-[#0F172A] mb-1">Arrastra tu archivo aquí o haz clic para seleccionar</p>
          <p class="text-[11px] text-slate-400">Formatos soportados: <strong>.xlsx</strong> (Excel) · <strong>.csv</strong> · máximo 10MB</p>
        </div>

        <div v-else class="flex items-center justify-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <FileText :size="22" class="text-emerald-600" />
          </div>
          <div class="text-left">
            <p class="text-[13px] font-bold text-[#0F172A]">{{ archivoSeleccionado.name }}</p>
            <p class="text-[11px] text-slate-400">{{ (archivoSeleccionado.size / 1024).toFixed(1) }} KB · listo para procesar</p>
          </div>
        </div>
      </div>

      <!-- Acciones -->
      <div class="flex items-center justify-between mt-4">
        <button v-if="archivoSeleccionado" @click="limpiar" class="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-500 hover:bg-slate-50 transition-all">
          <RefreshCw :size="12" /> Cambiar archivo
        </button>
        <div v-else />
        <button
          @click="procesarArchivo"
          :disabled="!archivoSeleccionado || procesando"
          class="flex items-center gap-1.5 h-9 px-6 rounded-lg text-[11px] font-bold shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          :class="archivoSeleccionado && !procesando ? 'bg-[#2447F9] text-white hover:bg-[#1D3DD9]' : 'bg-slate-200 text-slate-400'"
        >
          <RefreshCw v-if="procesando" :size="13" class="animate-spin" />
          <Upload v-else :size="13" />
          {{ procesando ? 'Procesando...' : 'Importar ahora' }}
        </button>
      </div>
    </div>

    <!-- Resultado -->
    <div v-if="resultadoVisible" class="bg-white rounded-2xl border border-emerald-200 shadow-sm p-6">
      <div class="flex items-center gap-2 mb-4">
        <CheckCircle :size="18" class="text-emerald-600" />
        <h3 class="text-[13px] font-bold text-[#0F172A]">Importación completada</h3>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="text-center p-3 bg-slate-50 rounded-xl">
          <div class="text-[22px] font-bold text-[#0F172A]">{{ resultadoMock.registros }}</div>
          <div class="text-[10px] text-slate-500 uppercase tracking-wide mt-0.5">Registros totales</div>
        </div>
        <div class="text-center p-3 bg-emerald-50 rounded-xl">
          <div class="text-[22px] font-bold text-emerald-700">{{ resultadoMock.exitosos }}</div>
          <div class="text-[10px] text-emerald-600 uppercase tracking-wide mt-0.5">Exitosos</div>
        </div>
        <div class="text-center p-3 bg-amber-50 rounded-xl">
          <div class="text-[22px] font-bold text-amber-700">{{ resultadoMock.duplicados }}</div>
          <div class="text-[10px] text-amber-600 uppercase tracking-wide mt-0.5">Duplicados</div>
        </div>
        <div class="text-center p-3 bg-red-50 rounded-xl">
          <div class="text-[22px] font-bold text-red-700">{{ resultadoMock.errores }}</div>
          <div class="text-[10px] text-red-600 uppercase tracking-wide mt-0.5">Errores</div>
        </div>
      </div>
      <div v-if="resultadoMock.errores > 0" class="mt-4 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <AlertCircle :size="15" class="text-amber-600 flex-shrink-0" />
        <p class="text-[11px] text-amber-700">Se encontraron <strong>{{ resultadoMock.errores }} registros con errores</strong>. Descarga el reporte para ver el detalle.</p>
        <button class="ml-auto flex items-center gap-1 h-7 px-3 rounded-lg bg-amber-100 text-amber-700 text-[10px] font-bold hover:bg-amber-200 transition-all flex-shrink-0">
          <Download :size="11" /> Reporte
        </button>
      </div>
    </div>

    <!-- Historial de importaciones -->
    <div>
      <h3 class="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-3">Historial de importaciones</h3>
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[700px]">
            <thead class="bg-[#F8FAFC] border-b border-slate-200">
              <tr>
                <th class="text-left px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Archivo</th>
                <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Registros</th>
                <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Exitosos</th>
                <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Duplicados</th>
                <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Errores</th>
                <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                <th class="text-right px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reporte</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="r in historial" :key="r.id" class="hover:bg-slate-50/60 transition-colors group">
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" :class="r.tipo === 'Excel' ? 'bg-emerald-50' : 'bg-[#EEF2FF]'">
                      <FileText :size="14" :class="r.tipo === 'Excel' ? 'text-emerald-600' : 'text-[#2447F9]'" />
                    </div>
                    <div>
                      <div class="text-[12px] font-semibold text-[#0F172A] truncate max-w-[200px]">{{ r.archivo }}</div>
                      <span class="text-[9px] font-bold px-1.5 py-0.5 rounded" :class="r.tipo === 'Excel' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'">{{ r.tipo }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3.5">
                  <div class="flex items-center gap-1 text-[11px] text-slate-500"><Clock :size="11" class="text-slate-400" />{{ r.fecha }}</div>
                </td>
                <td class="px-4 py-3.5 text-[12px] font-bold text-[#0F172A]">{{ r.registros.toLocaleString('es-CO') }}</td>
                <td class="px-4 py-3.5"><span class="text-[12px] font-bold text-emerald-600">{{ r.exitosos.toLocaleString('es-CO') }}</span></td>
                <td class="px-4 py-3.5"><span class="text-[12px] font-bold text-amber-600">{{ r.duplicados }}</span></td>
                <td class="px-4 py-3.5">
                  <span class="text-[12px] font-bold" :class="r.errores > 0 ? 'text-red-600' : 'text-slate-400'">{{ r.errores }}</span>
                </td>
                <td class="px-4 py-3.5">
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border" :class="estadoStyle(r.estado)">
                    <CheckCircle v-if="r.estado === 'Completado'" :size="9" />
                    <AlertCircle v-else-if="r.estado === 'Con errores'" :size="9" />
                    {{ r.estado }}
                  </span>
                </td>
                <td class="px-5 py-3.5 text-right">
                  <button v-if="r.errores > 0" class="flex items-center gap-1 h-7 px-2.5 rounded-lg border border-slate-200 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-all ml-auto">
                    <Download :size="11" /> Errores
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
