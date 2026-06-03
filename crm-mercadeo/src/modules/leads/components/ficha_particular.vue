<script setup lang="ts">
import { ref, computed } from 'vue'

// --- INTERFACES DE MODELO ---
export interface ServicioParticular { 
  nombre: string; 
  fecha: string; 
  estado: 'Activo' | 'Terminado'; 
}

export interface Beneficiario { 
  nombreCompleto: string; 
  tipoDocumento: string; 
  documento: string; 
  edad: number; 
  genero: string; 
  telefono?: string; 
  parentesco: string; 
}

export interface InteraccionesRedes {
  instagram?: number;
  facebook?: number;
  linkedin?: number;
  whatsapp?: number;
}

export interface Contacto { 
  idUnico: string; 
  nombreCompleto: string; 
  rol: 'titular' | 'beneficiario'; 
  tipoDocumento: string; 
  documento: string; 
  telefono: string; 
  whatsapp: string; 
  email: string; 
  ciudad: string; 
  pais: string; 
  canalOrigen: string; 
  campana: string; 
  estadoLead: string; 
  ultimoContacto: string; 
  proximoContacto: string; 
  cantidadLlamadas: number; 
  cantidadEmails: number; 
  cantidadInteraccionesRedes?: InteraccionesRedes;
  notes?: string; 
  edad: number; 
  genero: string; 
  serviciosHistoricos: ServicioParticular[]; 
  beneficiariosAsociados?: Beneficiario[]; 
  bitacora?: unknown[]; 
}

// --- PROPS & EMITS ---
const props = defineProps<{
  contacto: Contacto
}>()

defineEmits<{
  (e: 'abrir-modal-beneficiario'): void
}>()

// --- CONTROL DE PESTAÑAS ---
type TabActiva = 'datos' | 'servicios'
const pestañaActiva = ref<TabActiva>('datos')

// --- FILTRADO DE SERVICIOS ---
const filtroNombre = ref('')
const fechaDesde = ref('')
const fechaHasta = ref('')

const serviciosHistoricosFiltrados = computed(() => {
  const servicios = props.contacto.serviciosHistoricos
  if (!servicios?.length) return []

  const queryNombre = filtroNombre.value.trim().toLowerCase()
  const desdeTime = fechaDesde.value ? new Date(`${fechaDesde.value}T00:00:00`).getTime() : null
  const hastaTime = fechaHasta.value ? new Date(`${fechaHasta.value}T23:59:59`).getTime() : null

  return servicios.filter(serv => {
    // Filtro por Nombre
    if (queryNombre && !serv.nombre.toLowerCase().includes(queryNombre)) {
      return false
    }

    // Filtro por Fechas
    if (desdeTime || hastaTime) {
      const fechaServicio = new Date(serv.fecha).getTime()
      if (isNaN(fechaServicio)) return false 
      if (desdeTime && fechaServicio < desdeTime) return false
      if (hastaTime && fechaServicio > hastaTime) return false
    }

    return true
  })
})

const limpiarFiltros = () => {
  filtroNombre.value = ''
  fechaDesde.value = ''
  fechaHasta.value = ''
}

// --- MÉTRICAS Y TOP SERVICIOS ---
const totalServicios = computed(() => props.contacto.serviciosHistoricos?.length || 0)
const serviciosActivosContador = computed(() => 
  props.contacto.serviciosHistoricos?.filter(s => s.estado === 'Activo').length || 0
)

const serviciosMasUsados = computed(() => {
  const servicios = props.contacto.serviciosHistoricos
  if (!servicios?.length) return []

  const mapeoFrecuencia: Record<string, number> = {}
  for (const s of servicios) {
    mapeoFrecuencia[s.nombre] = (mapeoFrecuencia[s.nombre] || 0) + 1
  }
  
  const listaOrdenada = Object.entries(mapeoFrecuencia)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 3)

  const maximoConteo = listaOrdenada[0]?.cantidad || 1

  const coloresBarras = [
    'from-blue-600 to-indigo-600 shadow-blue-100',
    'from-sky-500 to-blue-500 shadow-sky-100',
    'from-slate-500 to-slate-600 shadow-slate-100'
  ]

  return listaOrdenada.map((item, index) => ({
    ...item,
    porcentaje: `${(item.cantidad / maximoConteo) * 100}%`,
    colorClass: coloresBarras[index] || 'from-slate-500 to-slate-600'
  }))
})

// --- MÉTRICAS DE REDES ---
const metricasRedes = computed(() => {
  const redes = props.contacto.cantidadInteraccionesRedes
  const lista = [
    { nombre: 'WhatsApp', cantidad: redes?.whatsapp ?? 32, color: 'bg-emerald-500', porcentaje: '50%' },
    { nombre: 'Instagram', cantidad: redes?.instagram ?? 14, color: 'bg-sky-500', porcentaje: '25%' },
    { nombre: 'Correo', cantidad: props.contacto.cantidadEmails ?? 12, color: 'bg-amber-500', porcentaje: '20%' },
    { nombre: 'Facebook', cantidad: redes?.facebook ?? 16, color: 'bg-blue-600', porcentaje: '15%' }
  ]

  return lista.sort((a, b) => b.cantidad - a.cantidad)
})
</script>

<template>
  <div class="flex-1 flex flex-col bg-white p-6 h-full max-h-full overflow-hidden select-none">
    
    <div class="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
      <div>
        <span class="text-[9px] bg-blue-50 text-blue-700 border border-blue-200 font-black px-2 py-0.5 rounded uppercase tracking-wider inline-block">
          {{ contacto.estadoLead }}
        </span>
        <h2 class="text-xl font-black text-slate-900 tracking-tight mt-1">
          {{ contacto.nombreCompleto }}
        </h2>
      </div>

      <div class="bg-slate-100 p-1 rounded-full inline-flex items-center gap-1 self-start sm:self-center border border-slate-200/60">
        <button 
          @click="pestañaActiva = 'datos'"
          :class="[
            'px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-200 cursor-pointer',
            pestañaActiva === 'datos' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'
          ]"
        >
          Datos Personales
        </button>
        <button 
          @click="pestañaActiva = 'servicios'"
          :class="[
            'px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-200 cursor-pointer',
            pestañaActiva === 'servicios' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'
          ]"
        >
          Servicios
        </button>
      </div>
    </div>

    <div class="flex-1 mt-5 min-h-0 overflow-hidden">
      
      <div v-if="pestañaActiva === 'datos'" class="grid grid-cols-1 md:grid-cols-12 gap-5 h-full overflow-y-auto pr-1 custom-scrollbar animate-fadeIn items-start">
        <div class="md:col-span-6 space-y-4">
          <div>
            <h3 class="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-2 pb-1 border-b border-slate-100">
              Canales Directos de Comunicación
            </h3>
            <div class="bg-slate-50/60 border border-slate-200/60 rounded-xl p-3 text-xs space-y-2.5">
              <div class="flex justify-between items-center"><span class="text-slate-400 font-bold">Teléfono:</span><strong class="text-slate-800 font-mono text-[11px]">{{ contacto.telefono }}</strong></div>
              <div class="flex justify-between items-center"><span class="text-slate-400 font-bold">WhatsApp Corp:</span><strong class="text-emerald-600 font-mono text-[11px]">➔ {{ contacto.whatsapp }}</strong></div>
              <div class="flex justify-between items-center"><span class="text-slate-400 font-bold">Email Asociado:</span><strong class="text-slate-800 truncate max-w-[200px]">{{ contacto.email }}</strong></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2 pb-1 border-b border-slate-100">
              <h3 class="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                Información Sociodemográfica y Legal
              </h3>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="bg-slate-50/40 p-2.5 rounded-xl border border-slate-200/40"><span class="text-slate-400 block text-[8px] uppercase tracking-wide">Género / Edad</span><strong class="text-slate-800 text-[11px] font-bold">{{ contacto.genero }}, {{ contacto.edad }} años</strong></div>
              <div class="bg-slate-50/40 p-2.5 rounded-xl border border-slate-200/40"><span class="text-slate-400 block text-[8px] uppercase tracking-wide">Identificación</span><strong class="text-slate-800 text-[11px] font-mono font-bold">{{ contacto.tipoDocumento }}-{{ contacto.documento }}</strong></div>
              <div class="bg-slate-50/40 p-2.5 rounded-xl border border-slate-200/40 col-span-2"><span class="text-slate-400 block text-[8px] uppercase tracking-wide">Ubicación Registrada</span><strong class="text-slate-800 text-[11px] font-bold">{{ contacto.ciudad }}, {{ contacto.pais }}</strong></div>
            </div>
          </div>
        </div>

        <div class="md:col-span-6">
          <div class="border border-slate-200 rounded-2xl bg-white p-4 shadow-sm">
            <div class="pb-2 border-b border-slate-100 mb-3">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Canal de Origen del Lead</span>
                <span class="text-[8px] bg-blue-50 text-blue-700 border border-blue-200 font-mono font-black px-1.5 py-0.5 rounded uppercase">Engaged</span>
              </div>
              <p class="text-[9px] text-slate-400 font-medium mt-0.5">Interacciones totales acumuladas</p>
            </div>
            
            <div class="space-y-3.5">
              <div v-for="red in metricasRedes" :key="red.nombre" class="space-y-1">
                <div class="flex justify-between text-slate-600 items-center">
                  <span class="text-slate-900 font-extrabold text-[11px]">{{ red.nombre }}</span>
                  <span class="font-mono text-slate-400 text-[10px] font-bold">{{ red.cantidad }} int.</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-2.5 border border-slate-200/30 shadow-inner overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-500" :class="red.color" :style="{ width: red.porcentaje }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="pestañaActiva === 'servicios'" class="flex flex-col h-full min-h-0 bg-slate-50/50 p-1 rounded-xl">
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-4 border-b border-slate-200 shrink-0 items-stretch">
          <div class="lg:col-span-4 flex flex-col justify-between bg-white border border-slate-200/80 p-3.5 rounded-xl shadow-xs">
            <div>
              <h3 class="text-sm font-black uppercase text-slate-900 tracking-tight">Historial de Catálogo</h3>
              <p class="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">Métricas de recurrencia y control de contratos del cliente.</p>
            </div>
            <div class="flex items-center gap-2 font-mono text-[10px] mt-3 lg:mt-0">
              <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-lg font-black shadow-2xs">Activos: {{ serviciosActivosContador }}</span>
              <span class="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-lg font-black shadow-2xs">Total: {{ totalServicios }}</span>
            </div>
          </div>

          <div class="lg:col-span-8 bg-white border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-center shadow-xs">
            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">📊 Top Servicios más contratados (Historial de uso)</span>
            <div v-if="serviciosMasUsados.length" class="space-y-2">
              <div v-for="item in serviciosMasUsados" :key="item.nombre" class="flex items-center gap-3">
                <div class="flex-1 bg-slate-100 rounded-lg h-7 relative overflow-hidden border border-slate-200/40 shadow-inner">
                  <div 
                    class="h-full bg-gradient-to-r flex items-center pl-3 transition-all duration-700 shadow-xs" 
                    :class="item.colorClass"
                    :style="{ width: item.porcentaje }"
                  >
                    <span class="text-[10px] font-black text-white truncate drop-shadow-xs">
                      {{ item.nombre }}
                    </span>
                  </div>
                </div>
                <div class="shrink-0 font-mono text-[10px] font-black bg-slate-50 text-slate-600 border border-slate-200 h-7 px-2.5 flex items-center justify-center rounded-lg shadow-2xs">
                  {{ item.cantidad }} u.
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4 text-[10px] text-slate-400 font-semibold">
              Sin datos de uso para calcular el top de servicios.
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 my-3 shrink-0 items-end">
          <div class="sm:col-span-5">
            <span class="text-[8px] text-slate-400 font-black uppercase block mb-1 tracking-wider">Filtrar por Nombre</span>
            <input 
              type="text" 
              v-model="filtroNombre" 
              placeholder="Escribe el nombre del servicio..." 
              class="w-full bg-white text-slate-800 placeholder-slate-400 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-blue-500 transition-all shadow-2xs" 
            />
          </div>
          <div class="sm:col-span-3">
            <span class="text-[8px] text-slate-400 font-black uppercase block mb-1 tracking-wider">Desde</span>
            <input 
              type="date" 
              v-model="fechaDesde" 
              class="w-full bg-white text-slate-700 rounded-lg border border-slate-200 px-2 py-0.5 text-[11px] font-mono focus:outline-none focus:border-blue-500 transition-all shadow-2xs"
            />
          </div>
          <div class="sm:col-span-3">
            <span class="text-[8px] text-slate-400 font-black uppercase block mb-1 tracking-wider">Hasta</span>
            <input 
              type="date" 
              v-model="fechaHasta" 
              class="w-full bg-white text-slate-700 rounded-lg border border-slate-200 px-2 py-0.5 text-[11px] font-mono focus:outline-none focus:border-blue-500 transition-all shadow-2xs"
            />
          </div>
          <div class="sm:col-span-1 flex justify-end">
            <button 
              @click="limpiarFiltros"
              title="Limpiar filtros"
              class="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-red-500 transition-all cursor-pointer shadow-2xs w-full text-center text-xs font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto min-h-0 border border-slate-200 rounded-xl bg-white custom-scrollbar shadow-xs">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 text-slate-400 font-black uppercase text-[8px] border-b border-slate-200 tracking-widest sticky top-0 z-10">
                <th class="p-3 pl-4">Detalle del Servicio</th>
                <th class="p-3">Fecha de Adquisición</th>
                <th class="p-3 text-right pr-4">Estado / Progreso</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-semibold text-slate-600">
              <tr v-for="(serv, idx) in serviciosHistoricosFiltrados" :key="idx" class="hover:bg-slate-50/40 transition-colors">
                <td class="p-3 pl-4">
                  <span class="font-extrabold text-slate-900 text-[11px] tracking-tight block truncate max-w-[300px]">
                    {{ serv.nombre }}
                  </span>
                </td>
                <td class="p-3 font-mono text-slate-500 text-[11px]">
                  {{ serv.fecha }}
                </td>
                <td class="p-3 text-right pr-4 whitespace-nowrap">
                  <span :class="[
                    'text-[7px] px-2 py-0.5 rounded font-black uppercase border tracking-wider inline-block mb-1', 
                    serv.estado === 'Activo' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'
                  ]">
                    {{ serv.estado }}
                  </span>
                  <div class="w-20 ml-auto bg-slate-100 rounded-full h-1">
                    <div class="h-1 rounded-full transition-all duration-300" :class="serv.estado === 'Activo' ? 'bg-emerald-500 w-full' : 'bg-slate-300 w-1/3'"></div>
                  </div>
                </td>
              </tr>
              <tr v-if="serviciosHistoricosFiltrados.length === 0">
                <td colspan="3" class="text-center p-8 text-[10px] text-slate-400 font-bold bg-slate-50/20">
                  Ningún servicio coincide con los parámetros aplicados.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div> </div>
  </div>
</template>

<style scoped>
.animate-fadeIn { animation: fadeIn 0.15s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: translateY(0); } }

.custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>