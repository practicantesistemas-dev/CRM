<script setup lang="ts">
import { ref, computed } from 'vue'

// --- INTERFACES / TYPES ---
type Vista = 'workflows' | 'servicios' | 'analytics'
type ClasificacionServicio = 'ALTA' | 'FRECUENTE' | 'PREMIUM' | 'MEDIA'
type FaseWorkflow = 'captacion' | 'nutricion' | 'conversion'

interface Workflow {
  id: number
  fase: FaseWorkflow
  nombre: string
  trigger: string
  accion: string
  cola: number
  conversion: string
}

interface Servicio {
  id: number
  nombre: string
  fecha: string
  leads: number
  conversion: string // Guardado como string con '%' para renderizado directo
  clasificacion: ClasificacionServicio
}

// --- ESTADOS REACTIVOS ---
const vistaActiva = ref<Vista>('workflows')
const buscarWorkflow = ref('')
const buscarServicio = ref('')

const workflows = ref<Workflow[]>([
  {
    id: 1,
    fase: 'captacion',
    nombre: 'Secuencia Bienvenida Automatizada',
    trigger: 'Formulario Web',
    accion: 'Notificación WhatsApp',
    cola: 142,
    conversion: '12.4%'
  },
  {
    id: 2,
    fase: 'nutricion',
    nombre: 'Recuperación de Leads Fríos',
    trigger: 'Inactividad 7 Días',
    accion: 'Email de Valor + Cupón',
    cola: 89,
    conversion: '5.8%'
  },
  {
    id: 3,
    fase: 'conversion',
    nombre: 'Recordatorio Agendamiento Clínico',
    trigger: 'Cita Pre-aprobada',
    accion: 'SMS + Confirmación',
    cola: 231,
    conversion: '42.1%'
  },
  {
    id: 4,
    fase: 'nutricion',
    nombre: 'Nutrición Pacientes Ortodoncia',
    trigger: 'Firma de Contrato',
    accion: 'Folleto WhatsApp',
    cola: 65,
    conversion: '18.2%'
  }
])

const servicios = ref<Servicio[]>([
  {
    id: 1,
    nombre: 'Diseño de Sonrisa Mockup',
    fecha: '2026-01-15',
    leads: 820,
    conversion: '38%',
    clasificacion: 'ALTA'
  },
  {
    id: 2,
    nombre: 'Profilaxis de Entrada',
    fecha: '2026-02-02',
    leads: 640,
    conversion: '26%',
    clasificacion: 'FRECUENTE'
  },
  {
    id: 3,
    nombre: 'Ortodoncia Invisible Premium',
    fecha: '2026-03-05',
    leads: 510,
    conversion: '42%',
    clasificacion: 'PREMIUM'
  },
  {
    id: 4,
    nombre: 'Endodoncia Premium',
    fecha: '2026-04-11',
    leads: 220,
    conversion: '18%',
    clasificacion: 'MEDIA'
  }
])

// --- COMPUTED PROPERTIES (FILTROS) ---
const workflowsFiltrados = computed(() => {
  const query = buscarWorkflow.value.trim().toLowerCase()
  return query 
    ? workflows.value.filter(w => w.nombre.toLowerCase().includes(query))
    : workflows.value
})

const serviciosFiltrados = computed(() => {
  const query = buscarServicio.value.trim().toLowerCase()
  return query
    ? servicios.value.filter(s => s.nombre.toLowerCase().includes(query))
    : servicios.value
})

// --- COMPUTED PROPERTIES (MÉTRICAS DINÁMICAS) ---
// Extrae los 3 servicios con más leads dinámicamente y calcula su barra proporcional
const topServicios = computed(() => {
  const listaOrdenada = [...servicios.value]
    .sort((a, b) => b.leads - a.leads)
    .slice(0, 3)

  const maxLeads = listaOrdenada[0]?.leads || 1

  // Clases de color para iterar estéticamente en las barras
  const colores = ['bg-[#3557ff]', 'bg-[#10b981]', 'bg-violet-500']

  return listaOrdenada.map((s, index) => ({
    id: s.id,
    nombreCorto: s.nombre.split(' (')[0], // Sanitización estética opcional
    nombreCompleto: s.nombre,
    leads: s.leads,
    porcentajeBarra: `${(s.leads / maxLeads) * 100}%`,
    color: colores[index] || 'bg-slate-500'
  }))
})

// Encuentra dinámicamente el servicio con menor tasa de conversión numérica
const servicioMenorRendimiento = computed(() => {
  if (!servicios.value.length) return null

  return [...servicios.value].sort((a, b) => {
    const numA = parseFloat(a.conversion.replace('%', '')) || 0
    const numB = parseFloat(b.conversion.replace('%', '')) || 0
    return numA - numB
  })[0]
})

// --- MAPPING DE CLASES CSS ---
const clasesClasificacion: Record<ClasificacionServicio, string> = {
  ALTA: 'bg-green-50 text-green-600',
  PREMIUM: 'bg-indigo-50 text-indigo-600',
  MEDIA: 'bg-orange-50 text-orange-600',
  FRECUENTE: 'bg-slate-100 text-slate-600'
}
</script>

<template>
  <div class="w-full min-h-screen bg-[#f4f6f9] p-4 md:p-5 overflow-auto select-none">
    
    <!-- TOP NAVIGATION BAR -->
    <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-5 w-full">
      <div class="bg-white rounded-2xl p-1.5 flex gap-2 shadow-sm border border-slate-200 w-fit">
        <button
          v-for="tab in (['workflows', 'servicios', 'analytics'] as const)"
          :key="tab"
          @click="vistaActiva = tab"
          class="px-5 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-200 cursor-pointer"
          :class="
            vistaActiva === tab
              ? 'bg-[#3557ff] text-white shadow-xs'
              : 'text-slate-500 hover:bg-slate-100'
          "
        >
          {{ tab }}
        </button>
      </div>

      <div class="flex gap-3 xl:ml-auto">
        <button class="bg-white border border-slate-200 rounded-xl px-4 py-2 text-[11px] font-bold text-slate-600 shadow-xs cursor-pointer hover:bg-slate-50 transition-colors">
          Fase: todos
        </button>
        <button class="bg-white border border-slate-200 rounded-xl px-4 py-2 text-[11px] font-bold text-slate-600 shadow-xs cursor-pointer hover:bg-slate-50 transition-colors">
          Tiempo: 30d
        </button>
      </div>
    </div>

    <!-- VISTA: WORKFLOWS -->
    <div v-if="vistaActiva === 'workflows'" class="flex flex-col gap-4 w-full animate-fadeIn">
      <div class="bg-white rounded-[22px] border border-slate-200 shadow-xs p-4 w-full">
        <input
          v-model="buscarWorkflow"
          type="text"
          placeholder="Buscar workflow por nombre..."
          class="w-full bg-[#f7f9fc] rounded-xl px-4 py-3 outline-none text-[12px] font-semibold text-slate-700 border border-slate-200/80 focus:border-[#3557ff] focus:bg-white transition-all"
        />
      </div>

      <div
        v-for="workflow in workflowsFiltrados"
        :key="workflow.id"
        class="bg-white rounded-[22px] border border-slate-200 shadow-xs px-5 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 hover:shadow-md transition-all duration-200 w-full"
      >
        <div class="flex flex-col gap-2.5">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-2 py-[4px] rounded-full bg-slate-100 text-[8px] font-black uppercase text-slate-600 tracking-wider border border-slate-200/40">
              {{ workflow.fase }}
            </span>
          </div>

          <div>
            <h3 class="text-[14px] font-black text-[#0f172a] tracking-tight leading-tight">
              {{ workflow.nombre }}
            </h3>
            <p class="text-[11px] text-slate-500 font-semibold mt-0.5">
              <span class="text-slate-400 font-normal">Disparador:</span> {{ workflow.trigger }} 
              <span class="text-blue-500 mx-1">➔</span> 
              <span class="text-slate-400 font-normal">Acción:</span> {{ workflow.accion }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-6 lg:gap-8 self-end lg:self-center">
          <div class="text-right">
            <span class="block text-[8px] font-black text-slate-400 tracking-widest uppercase">EN COLA</span>
            <strong class="text-[16px] font-mono font-black text-[#0f172a]">{{ workflow.cola }}</strong>
          </div>
          <div class="text-right">
            <span class="block text-[8px] font-black text-slate-400 tracking-widest uppercase">CONVERSIÓN</span>
            <strong class="text-[16px] font-mono font-black text-[#10b981]">{{ workflow.conversion }}</strong>
          </div>
        </div>
      </div>

      <div v-if="workflowsFiltrados.length === 0" class="text-center py-12 bg-white rounded-[22px] border border-slate-200 text-xs text-slate-400 font-bold">
        No se encontraron workflows con ese criterio de búsqueda.
      </div>
    </div>

    <!-- VISTA: SERVICIOS -->
    <div v-if="vistaActiva === 'servicios'" class="flex flex-col gap-5 w-full animate-fadeIn">
      
      <!-- Sección Paneles Métricas Superiores -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

        <!-- Kpi 1: Top Servicios (Dinamizado) -->
        <div class="bg-white rounded-[20px] border border-slate-200 shadow-xs p-4 w-full flex flex-col justify-between">
          <div class="mb-3">
            <h3 class="text-[12px] font-black text-[#0f172a] uppercase tracking-wide">Top Servicios</h3>
            <p class="text-[10px] text-slate-400 font-medium mt-0.5">Más demandados por volumen de leads</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div v-for="top in topServicios" :key="top.id" class="flex flex-col justify-end">
              <div class="flex justify-between items-center mb-1 gap-1">
                <span class="text-[10px] font-bold text-slate-600 truncate" :title="top.nombreCompleto">
                  {{ top.nombreCompleto }}
                </span>
                <strong class="text-[10px] font-mono font-black text-slate-800 shrink-0">{{ top.leads }}</strong>
              </div>
              <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/30 shadow-inner">
                <div 
                  class="h-full rounded-full transition-all duration-500" 
                  :class="top.color"
                  :style="{ width: top.porcentajeBarra }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Kpi 2: Menor Rendimiento (Dinamizado) -->
        <div class="bg-white rounded-[20px] border border-slate-200 shadow-xs p-4 w-full flex flex-col justify-between">
          <div class="mb-2">
            <h3 class="text-[12px] font-black text-[#0f172a] uppercase tracking-wide">Menor Rendimiento</h3>
            <p class="text-[10px] text-slate-400 font-medium mt-0.5">Conversión comercial más baja del catálogo</p>
          </div>

          <div v-if="servicioMenorRendimiento" class="flex items-center justify-between bg-red-50/40 border border-red-100 p-2.5 rounded-xl">
            <div>
              <strong class="text-[11px] font-black text-slate-800 block">{{ servicioMenorRendimiento.nombre }}</strong>
              <p class="text-[9px] text-red-500 font-semibold mt-0.5">Requiere optimizar flujo o canales</p>
            </div>
            <span class="text-[13px] font-mono font-black text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg shadow-2xs">
              {{ servicioMenorRendimiento.conversion }}
            </span>
          </div>
        </div>

      </div>

      <!-- Tabla Principal de Gestión -->
      <div class="bg-white rounded-[20px] border border-slate-200 shadow-xs overflow-hidden h-fit w-full">
        
        <div class="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 class="text-[13px] font-black text-[#0f172a] uppercase tracking-wide">Servicios Activos</h2>
            <p class="text-[10px] text-slate-400 font-medium mt-0.5">
              Rendimiento comercial y comportamiento analítico
            </p>
          </div>

          <div class="flex items-center gap-2">
            <input
              v-model="buscarServicio"
              type="text"
              placeholder="Buscar servicio..."
              class="bg-[#f7f9fc] rounded-xl px-3 h-[38px] outline-none text-[11px] font-semibold border border-slate-200/80 focus:border-[#3557ff] focus:bg-white transition-all w-full sm:w-[220px]"
            />

            <select
              class="bg-white border border-slate-200 rounded-xl px-3 h-[38px] text-[11px] font-black text-slate-600 outline-none cursor-pointer hover:bg-slate-50"
            >
              <option>Todos los canales</option>
              <option>WhatsApp</option>
              <option>Correo</option>
              <option>Llamada</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto w-full">
          <table class="w-full min-w-[800px] table-auto text-left border-collapse">
            <thead class="bg-[#f8fafc] border-b border-slate-200">
              <tr>
                <th class="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest w-[35%]">Servicio</th>
                <th class="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Fecha Lanzamiento</th>
                <th class="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Leads Totales</th>
                <th class="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Conversión</th>
                <th class="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Clasificación</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
              <tr
                v-for="servicio in serviciosFiltrados"
                :key="servicio.id"
                class="hover:bg-slate-50/60 transition-colors"
              >
                <td class="px-5 py-3.5">
                  <div class="flex flex-col">
                    <strong class="text-[12px] font-black text-slate-900 leading-tight">
                      {{ servicio.nombre }}
                    </strong>
                    <span class="text-[9px] text-slate-400 font-medium mt-0.5">
                      Campaña automatizada activa
                    </span>
                  </div>
                </td>

                <td class="px-5 py-3.5 font-mono text-slate-500 text-[11px]">
                  {{ servicio.fecha }}
                </td>

                <td class="px-5 py-3.5 font-mono text-[11px] text-slate-800 font-bold">
                  {{ servicio.leads }}
                </td>

                <td class="px-5 py-3.5 font-mono text-[11px] text-[#10b981] font-black">
                  {{ servicio.conversion }}
                </td>

                <td class="px-5 py-3.5">
                  <span
                    class="px-2.5 py-[4px] rounded-full text-[8px] font-black uppercase tracking-wider border border-slate-200/30 inline-block"
                    :class="clasesClasificacion[servicio.clasificacion] || 'bg-slate-100 text-slate-600'"
                  >
                    {{ servicio.clasificacion }}
                  </span>
                </td>
              </tr>
              
              <tr v-if="serviciosFiltrados.length === 0">
                <td colspan="5" class="text-center p-8 text-xs text-slate-400 font-bold bg-slate-50/20">
                  Ningún servicio coincide con la búsqueda.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>

    <!-- VISTA: ANALYTICS -->
    <div v-if="vistaActiva === 'analytics'" class="w-full h-[85vh] animate-fadeIn">
      <iframe
        src="https://lookerstudio.google.com/embed/reporting/your-report-id/page/p_123456"
        class="w-full h-full rounded-[22px] border border-slate-200 shadow-sm bg-white"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>

  </div>
</template>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>