<script setup lang="ts">
import { ref, computed } from 'vue'

// --- ESTADOS INTERNOS DEL MÓDULO GENERAL ---
const subVistaActiva = ref<'automatizaciones' | 'servicios'>('automatizaciones')

// --- ESTADOS DE DESPLEGABLES DE FILTROS ---
const filtroAbierto = ref<string | null>(null)

// --- FILTROS GLOBALES ---
const filtroFase = ref<string>('todos')
const filtroFecha = ref<string>('30d')
const filtroDemanda = ref<string>('todos')
const filtroCanalPrincipal = ref<string>('todos')

// --- FILTROS ESPECÍFICOS DE BÚSQUEDA ---
const busquedaServicio = ref('')
const busquedaWorkflow = ref('')
const paginaActual = ref(1)
const itemsPorPagina = 6

// --- DATA MOCK ---
const workflows = ref([
  { id: 1, nombre: 'Secuencia Bienvenida Automatizada', fase: 'captacion', canal: 'whatsapp', trigger: 'Formulario Web', accion: 'Notificación WhatsApp', activos: 142, conversion: '12.4%' },
  { id: 2, nombre: 'Recuperación de Leads Fríos', fase: 'nutricion', canal: 'correo', trigger: 'Inactividad 7 Días', accion: 'Email de Valor + Cupón', activos: 89, conversion: '5.8%' },
  { id: 3, nombre: 'Recordatorio Agendamiento Clínico', fase: 'conversion', canal: 'sms', trigger: 'Cita Pre-aprobada', accion: 'SMS + Enlace Confirmación', activos: 231, conversion: '42.1%' },
  { id: 4, nombre: 'Nutrición Pacientes Ortodoncia', fase: 'nutricion', canal: 'whatsapp', trigger: 'Firma de Contrato', accion: 'Folleto de Cuidados WA', activos: 65, conversion: '18.2%' },
  { id: 5, nombre: 'Seguimiento Post-Consulta 24h', fase: 'nutricion', canal: 'whatsapp', trigger: 'Tratamiento Finalizado', accion: 'Encuesta Satisfacción', activos: 112, conversion: '29.5%' },
  { id: 6, nombre: 'Re-enganche de Presupuestos Altos', fase: 'conversion', canal: 'llamada', trigger: 'Presupuesto > 30 Días', accion: 'Llamada Prioritaria', activos: 43, conversion: '11.1%' }
])

const servicios = ref([
  { id: 1, nombre: 'Diseño de Sonrisa Mockup', fase: 'conversion', demanda: 'alta', color: 'pink', canal: 'whatsapp', fechaCreacion: '2026-01-15', leads7d: 180, leads30d: 820, leads90d: 2450 },
  { id: 2, nombre: 'Profilaxis de Entrada', fase: 'captacion', demanda: 'frecuente', color: 'blue', canal: 'correo', fechaCreacion: '2026-02-02', leads7d: 140, leads30d: 640, leads90d: 1920 },
  { id: 3, nombre: 'Blanqueamiento Dental Express', fase: 'nutricion', demanda: 'estacional', color: 'amber', canal: 'whatsapp', fechaCreacion: '2026-02-20', leads7d: 45, leads30d: 195, leads90d: 580 },
  { id: 4, nombre: 'Ortodoncia Invisible Premium', fase: 'conversion', demanda: 'alta', color: 'pink', canal: 'whatsapp', fechaCreacion: '2026-03-05', leads7d: 110, leads30d: 510, leads90d: 1530 },
  { id: 5, merge: true, id_padre: 5, nombre: 'Implante Dental Monofásico', fase: 'conversion', demanda: 'critico', color: 'pink', canal: 'llamada', fechaCreacion: '2026-03-29', leads7d: 22, leads30d: 95, leads90d: 285 },
  { id: 6, nombre: 'Endodoncia Premium Robotizada', fase: 'nutricion', demanda: 'frecuente', color: 'amber', canal: 'correo', fechaCreacion: '2026-04-12', leads7d: 30, leads30d: 120, leads90d: 360 },
  { id: 7, nombre: 'Carillas de Porcelana Avanzadas', fase: 'conversion', demanda: 'alta', color: 'pink', canal: 'llamada', fechaCreacion: '2026-05-01', leads7d: 75, leads30d: 340, leads90d: 1020 }
])

const datosFechasPorPeriodo = computed(() => {
  if (filtroFecha.value === '7d') {
    return [
      { etiqueta: 'Lun', leadsTotales: 42, porcentaje: '60%' },
      { etiqueta: 'Mar', leadsTotales: 68, porcentaje: '85%' },
      { etiqueta: 'Mié', leadsTotales: 80, porcentaje: '100%' },
      { etiqueta: 'Jue', leadsTotales: 51, porcentaje: '70%' },
      { etiqueta: 'Vie', leadsTotales: 73, porcentaje: '90%' }
    ]
  } else if (filtroFecha.value === '90d') {
    return [
      { etiqueta: 'Marz', leadsTotales: 2100, porcentaje: '80%' },
      { etiqueta: 'Abr', leadsTotales: 1850, porcentaje: '72%' },
      { etiqueta: 'May', leadsTotales: 2550, porcentaje: '100%' },
      { etiqueta: 'Jun', leadsTotales: 1900, porcentaje: '75%' },
      { etiqueta: 'Jul', leadsTotales: 2300, porcentaje: '91%' }
    ]
  } else {
    return [
      { etiqueta: 'Sem 1', leadsTotales: 420, porcentaje: '55%' },
      { etiqueta: 'Sem 2', leadsTotales: 680, porcentaje: '82%' },
      { etiqueta: 'Sem 3', leadsTotales: 950, porcentaje: '100%' },
      { etiqueta: 'Sem 4', leadsTotales: 710, porcentaje: '78%' }
    ]
  }
})

const toggleFiltro = (menu: string) => {
  filtroAbierto.value = filtroAbierto.value === menu ? null : menu
}

const cerrarFiltros = () => { filtroAbierto.value = null }

const workflowsFiltrados = computed(() => {
  return workflows.value.filter(wf => {
    const coincideFase = filtroFase.value === 'todos' || wf.fase === filtroFase.value
    const coincideBusqueda = wf.nombre.toLowerCase().includes(busquedaWorkflow.value.toLowerCase())
    return coincideFase && coincideBusqueda
  })
})

const serviciosFiltradosBase = computed(() => {
  return servicios.value.filter(sv => {
    const coincideFase = filtroFase.value === 'todos' || sv.fase === filtroFase.value
    const coincideDemanda = filtroDemanda.value === 'todos' || sv.demanda === filtroDemanda.value
    const coincideCanal = filtroCanalPrincipal.value === 'todos' || sv.canal === filtroCanalPrincipal.value
    const coincideBusqueda = sv.nombre.toLowerCase().includes(busquedaServicio.value.toLowerCase())
    return coincideFase && coincideDemanda && coincideCanal && coincideBusqueda
  })
})

const obtenerLeadsPorPeriodo = (sv: any) => {
  if (filtroFecha.value === '7d') return sv.leads7d
  if (filtroFecha.value === '90d') return sv.leads90d
  return sv.leads30d
}

const serviciosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina
  return serviciosFiltradosBase.value.slice(inicio, inicio + itemsPorPagina)
})

const totalPaginas = computed(() => Math.ceil(serviciosFiltradosBase.value.length / itemsPorPagina))

const topServiciosDemandados = computed(() => {
  return [...serviciosFiltradosBase.value]
    .sort((a, b) => obtenerLeadsPorPeriodo(b) - obtenerLeadsPorPeriodo(a))
    .slice(0, 4)
})

const resetPaginacion = () => { paginaActual.value = 1 }
</script>

<template>
  <div class="h-screen flex flex-col p-5 bg-white text-slate-700 select-none overflow-hidden">
    
    <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-3 border-b border-slate-100 shrink-0">
      
      <div class="flex bg-slate-100 p-1 rounded-xl gap-1 w-full sm:w-auto max-w-xs shrink-0">
        <button 
          @click="subVistaActiva = 'automatizaciones'; resetPaginacion(); cerrarFiltros()" 
          :class="['flex-1 px-4 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all rounded-lg cursor-pointer text-center', subVistaActiva === 'automatizaciones' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-400 hover:text-slate-600']"
        >
          Workflows
        </button>
        <button 
          @click="subVistaActiva = 'servicios'; resetPaginacion(); cerrarFiltros()" 
          :class="['flex-1 px-4 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all rounded-lg cursor-pointer text-center', subVistaActiva === 'servicios' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-400 hover:text-slate-600']"
        >
          Servicios
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-1.5 text-[10px] font-bold z-50">
        <div class="relative">
          <button @click="toggleFiltro('ciclo')" class="px-2 py-1.5 bg-slate-50 border border-slate-200/80 hover:bg-slate-100 rounded-lg flex items-center gap-1 cursor-pointer">
            <span class="text-slate-400">Fase:</span> <span class="text-slate-900 uppercase font-extrabold">{{ filtroFase }}</span>
            <span class="text-[7px] text-slate-400">▼</span>
          </button>
          <div v-show="filtroAbierto === 'ciclo'" class="absolute left-0 xl:right-0 xl:left-auto mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-xl p-1 flex flex-col gap-0.5 animate-fadeIn">
            <button @click="filtroFase = 'todos'; resetPaginacion(); cerrarFiltros()" class="text-left px-2 py-1 hover:bg-slate-50 rounded text-slate-700 font-semibold">Todas las Etapas</button>
            <button @click="filtroFase = 'captacion'; resetPaginacion(); cerrarFiltros()" class="text-left px-2 py-1 hover:bg-slate-50 rounded text-slate-700 font-semibold">🧲 Captación</button>
            <button @click="filtroFase = 'nutricion'; resetPaginacion(); cerrarFiltros()" class="text-left px-2 py-1 hover:bg-slate-50 rounded text-slate-700 font-semibold">🧬 Nutrición</button>
            <button @click="filtroFase = 'conversion'; resetPaginacion(); cerrarFiltros()" class="text-left px-2 py-1 hover:bg-slate-50 rounded text-slate-700 font-semibold">💰 Conversión</button>
          </div>
        </div>

        <div class="relative">
          <button @click="toggleFiltro('fecha')" class="px-2 py-1.5 bg-slate-50 border border-slate-200/80 hover:bg-slate-100 rounded-lg flex items-center gap-1 cursor-pointer">
            <span class="text-slate-400">Tiempo:</span> <span class="text-slate-900 uppercase font-extrabold">{{ filtroFecha }}</span>
            <span class="text-[7px] text-slate-400">▼</span>
          </button>
          <div v-show="filtroAbierto === 'fecha'" class="absolute left-0 xl:right-0 xl:left-auto mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-xl p-1 flex flex-col gap-0.5 animate-fadeIn">
            <button @click="filtroFecha = '7d'; cerrarFiltros()" class="text-left px-2 py-1 hover:bg-slate-50 rounded text-slate-700 font-semibold">Últimos 7 días</button>
            <button @click="filtroFecha = '30d'; cerrarFiltros()" class="text-left px-2 py-1 hover:bg-slate-50 rounded text-slate-700 font-semibold">Últimos 30 días</button>
            <button @click="filtroFecha = '90d'; cerrarFiltros()" class="text-left px-2 py-1 hover:bg-slate-50 rounded text-slate-700 font-semibold">Trimestre</button>
          </div>
        </div>

        <template v-if="subVistaActiva === 'servicios'">
          <div class="relative animate-fadeIn">
            <button @click="toggleFiltro('demanda')" class="px-2 py-1.5 bg-slate-50 border border-slate-200/80 hover:bg-slate-100 rounded-lg flex items-center gap-1 cursor-pointer">
              <span class="text-slate-400">Volumen:</span> <span class="text-slate-900 uppercase font-extrabold">{{ filtroDemanda }}</span>
              <span class="text-[7px] text-slate-400">▼</span>
            </button>
            <div v-show="filtroAbierto === 'demanda'" class="absolute left-0 xl:right-0 xl:left-auto mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-xl p-1 flex flex-col gap-0.5 z-50">
              <button @click="filtroDemanda = 'todos'; resetPaginacion(); cerrarFiltros()" class="text-left px-2 py-1 hover:bg-slate-50 rounded text-slate-700 font-semibold">Toda Demanda</button>
              <button @click="filtroDemanda = 'alta'; resetPaginacion(); cerrarFiltros()" class="text-left px-2 py-1 hover:bg-slate-50 rounded text-slate-700 font-semibold">🔥 Alta Demanda</button>
              <button @click="filtroDemanda = 'frecuente'; resetPaginacion(); cerrarFiltros()" class="text-left px-2 py-1 hover:bg-slate-50 rounded text-slate-700 font-semibold">🔄 Frecuente</button>
              <button @click="filtroDemanda = 'estacional'; resetPaginacion(); cerrarFiltros()" class="text-left px-2 py-1 hover:bg-slate-50 rounded text-slate-700 font-semibold">☀️ Estacional</button>
              <button @click="filtroDemanda = 'critico'; resetPaginacion(); cerrarFiltros()" class="text-left px-2 py-1 hover:bg-slate-50 rounded text-slate-700 font-semibold">⚠️ Crítico</button>
            </div>
          </div>

          <div class="relative animate-fadeIn">
            <button @click="toggleFiltro('canal')" class="px-2 py-1.5 bg-slate-50 border border-slate-200/80 hover:bg-slate-100 rounded-lg flex items-center gap-1 cursor-pointer">
              <span class="text-slate-400">Canal:</span> <span class="text-slate-900 uppercase font-extrabold">{{ filtroCanalPrincipal }}</span>
              <span class="text-[7px] text-slate-400">▼</span>
            </button>
            <div v-show="filtroAbierto === 'canal'" class="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-xl p-1 flex flex-col gap-0.5 z-50">
              <button @click="filtroCanalPrincipal = 'todos'; resetPaginacion(); cerrarFiltros()" class="text-left px-2 py-1 hover:bg-slate-50 rounded text-slate-700 font-semibold">Todos los Canales</button>
              <button @click="filtroCanalPrincipal = 'whatsapp'; resetPaginacion(); cerrarFiltros()" class="text-left px-2 py-1 hover:bg-slate-50 rounded text-slate-700 font-semibold">💬 WhatsApp</button>
              <button @click="filtroCanalPrincipal = 'correo'; resetPaginacion(); cerrarFiltros()" class="text-left px-2 py-1 hover:bg-slate-50 rounded text-slate-700 font-semibold">✉️ Correo</button>
              <button @click="filtroCanalPrincipal = 'llamada'; resetPaginacion(); cerrarFiltros()" class="text-left px-2 py-1 hover:bg-slate-50 rounded text-slate-700 font-semibold">📞 Llamadas</button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="flex-1 min-h-0 pt-4">
      
      <div v-if="subVistaActiva === 'automatizaciones'" class="h-full flex flex-col space-y-3 animate-fadeIn max-w-5xl">
        <div class="shrink-0">
          <input 
            v-model="busquedaWorkflow"
            type="text" 
            placeholder="🔍 Buscar flujo de trabajo por nombre..." 
            class="w-full max-w-md bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs font-semibold outline-none focus:border-blue-400 focus:bg-white transition-all"
          />
        </div>

        <div class="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[calc(100vh-180px)] custom-scrollbar">
          <div 
            v-for="wf in workflowsFiltrados" 
            :key="wf.id" 
            class="bg-white rounded-xl border border-slate-200/70 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4 p-3.5 transition-all hover:border-slate-300 relative overflow-hidden"
            :class="[
              wf.fase === 'captacion' ? 'border-l-4 border-l-blue-500' : 
              wf.fase === 'nutricion' ? 'border-l-4 border-l-amber-500' : 'border-l-4 border-l-emerald-500'
            ]"
          >
            <div class="min-w-0 flex-1 space-y-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-[8px] bg-slate-100 font-black px-1.5 py-0.5 rounded uppercase tracking-wide text-slate-500">
                  {{ wf.fase }}
                </span>
                <span class="text-[8px] bg-blue-50 border border-blue-100 font-black px-1.5 py-0.5 rounded uppercase tracking-wide text-blue-700">
                  {{ wf.canal }}
                </span>
                <h4 class="font-extrabold text-slate-900 text-xs tracking-tight truncate">{{ wf.nombre }}</h4>
              </div>
              <div class="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span class="text-[10px] font-mono text-slate-600 bg-slate-50 border border-slate-200/50 px-1.5 py-0.2 rounded">{{ wf.trigger }}</span>
                <span class="text-slate-300 font-bold">➔</span>
                <span class="text-[10px] text-blue-600 font-mono font-bold">{{ wf.accion }}</span>
              </div>
            </div>

            <div class="flex items-center gap-5 shrink-0 text-right md:border-l md:pl-5 border-slate-100 text-xs font-bold">
              <div class="w-16">
                <span class="text-[8px] text-slate-400 block uppercase font-bold tracking-wider">En Cola</span>
                <span class="font-mono text-slate-800 font-black text-xs">{{ wf.activos }}</span>
              </div>
              <div class="w-16">
                <span class="text-[8px] text-slate-400 block uppercase font-bold tracking-wider">Conversión</span>
                <span class="font-mono text-emerald-600 font-black text-xs">{{ wf.conversion }}</span>
              </div>
            </div>
          </div>

          <div v-if="workflowsFiltrados.length === 0" class="text-center p-8 text-slate-400 text-xs font-medium bg-slate-50/50 rounded-xl border border-dashed">
            No se encontraron flujos que coincidan.
          </div>
        </div>
      </div>

      <div v-if="subVistaActiva === 'servicios'" class="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full items-start animate-fadeIn overflow-y-auto lg:overflow-hidden pb-6">
        
        <div class="lg:col-span-7 flex flex-col space-y-2 justify-between">
          <div class="space-y-2">
            <input 
              v-model="busquedaServicio"
              type="text" 
              placeholder="🔍 Filtrar catálogo masivo..." 
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-blue-400 focus:bg-white transition-all"
              @input="paginaActual = 1"
            />

            <div class="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-50 text-slate-500 font-bold uppercase text-[9px] border-b border-slate-200 tracking-wider">
                    <th class="p-3 pl-4">Servicio</th>
                    <th class="p-3">Clasificación</th>
                    <th class="p-3 text-center">Fecha</th>
                    <th class="p-3 text-right pr-4">Total Leads</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-semibold text-slate-700">
                  <tr v-for="sv in serviciosPaginados" :key="sv.id" class="hover:bg-slate-50/50 transition-colors">
                    <td class="p-3 pl-4">
                      <p class="font-bold text-slate-900 text-[11px] max-w-[180px] truncate">{{ sv.nombre }}</p>
                      <div class="flex gap-1 items-center mt-0.5 text-[7px] font-mono text-slate-400">
                        <span class="uppercase tracking-wider">Fase: {{ sv.fase }}</span>
                        <span class="text-blue-500 font-bold">[{{ sv.canal }}]</span>
                      </div>
                    </td>
                    <td class="p-3">
                      <span :class="['px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-wider', sv.color === 'pink' ? 'bg-pink-50 text-pink-700 border-pink-200' : sv.color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200']">
                        {{ sv.demanda }}
                      </span>
                    </td>
                    <td class="p-3 text-center font-mono text-[10px] text-slate-500 whitespace-nowrap">
                      {{ sv.fechaCreacion }}
                    </td>
                    <td class="p-3 text-right pr-4 font-mono font-black text-slate-900">
                      {{ obtenerLeadsPorPeriodo(sv) }}
                    </td>
                  </tr>
                  <tr v-if="serviciosPaginados.length === 0">
                    <td colspan="4" class="text-center p-6 text-slate-400 font-medium">No hay concordancias.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-if="totalPaginas > 1" class="bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-2 flex items-center justify-between text-[10px] font-bold text-slate-500 mt-1">
            <span>Pág. {{ paginaActual }} de {{ totalPaginas }}</span>
            <div class="flex items-center gap-1">
              <button :disabled="paginaActual === 1" @click="paginaActual--" class="px-2 py-0.5 bg-white border border-slate-200 rounded disabled:opacity-40 cursor-pointer">◀</button>
              <button :disabled="paginaActual === totalPaginas" @click="paginaActual++" class="px-2 py-0.5 bg-white border border-slate-200 rounded disabled:opacity-40 cursor-pointer">▶</button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-5 grid grid-cols-1 gap-3">
          <div class="p-4 border border-slate-200 rounded-xl bg-slate-50/40 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between">
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Servicios Más Demandados</span>
                <span class="text-[8px] bg-blue-100 text-blue-800 font-mono font-black px-1 rounded uppercase">{{ filtroFecha }}</span>
              </div>
              <span class="text-[8px] text-slate-400 font-semibold block mb-3">Ranking de captación ajustado al periodo</span>
            </div>
            
            <div class="space-y-2.5 text-[10px] font-bold">
              <div v-for="sv in topServiciosDemandados" :key="sv.id" class="space-y-0.5">
                <div class="flex justify-between text-slate-600 font-semibold">
                  <span class="truncate pr-4 max-w-[170px] text-slate-900">{{ sv.nombre }}</span>
                  <span class="font-mono text-blue-700">{{ obtenerLeadsPorPeriodo(sv) }} leads</span>
                </div>
                <div class="w-full bg-slate-200/60 rounded-full h-1.5">
                  <div 
                    class="h-1.5 rounded-full transition-all duration-500" 
                    :class="sv.color === 'pink' ? 'bg-pink-500' : sv.color === 'blue' ? 'bg-blue-500' : 'bg-amber-500'" 
                    :style="{ width: Math.min((obtenerLeadsPorPeriodo(sv) / (filtroFecha === '7d' ? 200 : filtroFecha === '90d' ? 2500 : 1000)) * 100, 100) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 border border-slate-200 rounded-xl bg-slate-50/40 flex flex-col justify-between">
            <div>
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Fechas con Mayor Demanda</span>
              <span class="text-[8px] text-slate-400 font-semibold block mb-2">Comportamiento cronológico del tráfico</span>
            </div>
            <div class="flex items-end justify-between h-24 pt-4 px-2 border-b border-slate-200/80">
              <div v-for="data in datosFechasPorPeriodo" :key="data.etiqueta" class="flex flex-col items-center gap-1 w-7 group">
                <div class="relative w-full flex justify-center">
                  <span class="absolute -top-6 bg-slate-900 text-white font-mono text-[8px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">{{ data.leadsTotales }}</span>
                  <div class="w-full bg-blue-600 rounded-t group-hover:bg-blue-700 transition-all duration-300" :style="{ height: data.porcentaje }"></div>
                </div>
                <span class="text-[8px] font-black text-slate-400 uppercase mt-1 tracking-tighter truncate w-full text-center">{{ data.etiqueta }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.animate-fadeIn { animation: fadeIn 0.12s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: translateY(0); } }

/* Scrollbar minimalista y limpio para la lista de workflows */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>