<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'

// --- INTERFACES ---
interface ServicioParticular { nombre: string; fecha: string; estado: 'Activo' | 'Terminado'; }
interface Beneficiario { nombreCompleto: string; tipoDocumento: string; documento: string; edad: number; genero: string; telefono?: string; parentesco: string; }
interface Contacto { idUnico: string; nombreCompleto: string; rol: 'titular' | 'beneficiario'; tipoDocumento: string; documento: string; telefono: string; whatsapp: string; email: string; ciudad: string; pais: string; canalOrigen: string; campana: string; estadoLead: string; ultimoContacto: string; proximoContacto: string; cantidadLlamadas: number; cantidadEmails: number; notes?: string; edad: number; genero: string; serviciosHistoricos: ServicioParticular[]; beneficiariosAsociados?: Beneficiario[]; }

// --- PROPS Y EMITS ---
const props = defineProps<{
  contactosFiltrados: Contacto[]
  contactoSeleccionado: Contacto | null
  modoVista: 'general' | 'particular'
  busqueda: string
  filtroRol: string
  filtroEstado: string
  filtroOrigen: string
  filtroCampana: string
  filtroEdad: string
}>()

const emit = defineEmits<{
  (e: 'seleccionar', contacto: Contacto): void
  (e: 'guardarNuevoProspecto', nuevoContacto: Partial<Contacto>): void
  (e: 'update:busqueda', val: string): void
  (e: 'update:filtroRol', val: string): void
  (e: 'update:filtroEstado', val: string): void
  (e: 'update:filtroOrigen', val: string): void
  (e: 'update:filtroCampana', val: string): void
  (e: 'update:filtroEdad', val: string): void
  (e: 'procesarCargaMasiva', data: { seccion: string; accion: string; maxPersonas?: number; archivo: File | null }): void
  (e: 'descargarPlantilla', seccion: string): void
}>()

// --- ESTADOS DE CONFIGURACIÓN DE CARGAS ---
const accionTitularesUnicos = ref('Activar')     // Acción para la nueva sección de Titulares
const accionDocumento = ref('Activar')          // Acción para Beneficiarios
const accionTitularInscripcion = ref('Activar') // Acción para determinar el rol del Titular en Inscripción
const maxPersonasInscripcion = ref(5)          // Máximo de personas asignadas por inscripción

// --- ESTADO MENÚ DESPLEGABLE (CARGA MASIVA) ---
const cargaMasivaAbierta = ref(false)
// Se actualizó el tipo para admitir 'titulares'
const seccionActiva = ref<'titulares' | 'beneficiarios' | 'inscripcion' | 'remplazo' | null>('titulares')

// Coordenadas dinámicas para el submenú flotante de Carga Masiva
const cargaTop = ref(0)
const cargaLeft = ref(0)

const alternarCargaMasiva = (event: MouseEvent) => {
  cargaMasivaAbierta.value = !cargaMasivaAbierta.value
  if (cargaMasivaAbierta.value) {
    const target = event.currentTarget as HTMLElement
    if (target) {
      const rect = target.getBoundingClientRect()
      cargaTop.value = rect.top
      cargaLeft.value = rect.right + 8 
    }
  }
}

// --- MANEJADOR DE ARCHIVOS PROCESANDO LOS PARÁMETROS ---
const manejarArchivo = (event: Event, seccion: string) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    
    let accionFinal = 'Inscribir'
    let maxPersonasFinal: number | undefined = undefined

    if (seccion === 'titulares') {
      accionFinal = accionTitularesUnicos.value
    } else if (seccion === 'beneficiarios') {
      accionFinal = accionDocumento.value
    } else if (seccion === 'inscripcion') {
      accionFinal = accionTitularInscripcion.value 
      maxPersonasFinal = maxPersonasInscripcion.value 
    }

    emit('procesarCargaMasiva', {
      seccion,
      accion: accionFinal,
      maxPersonas: maxPersonasFinal,
      archivo: target.files[0]
    })
    
    cargaMasivaAbierta.value = false 
  }
}

// --- ESTADO DEL MODAL AGREGAR PROSPECTO ---
const modalAgregarAbierto = ref(false)
const nuevoProspecto = ref({
  nombreCompleto: '', tipoDocumento: 'CC', documento: '', telefono: '', whatsapp: '', email: '', canalOrigen: 'Llamada Directa', campana: 'Registro Manual', estadoLead: 'Prospecto', rol: 'titular' as 'titular'
})

const cerrarModalProspecto = () => {
  modalAgregarAbierto.value = false
  nuevoProspecto.value = {
    nombreCompleto: '', tipoDocumento: 'CC', documento: '', telefono: '', whatsapp: '', email: '', canalOrigen: 'Llamada Directa', campana: 'Registro Manual', estadoLead: 'Prospecto', rol: 'titular'
  }
}

const procesarGuardado = () => {
  if (!nuevoProspecto.value.nombreCompleto || !nuevoProspecto.value.documento) {
    alert('Por favor, ingresa al menos el Nombre y el Documento.')
    return
  }
  emit('guardarNuevoProspecto', { ...nuevoProspecto.value, idUnico: 'ID-' + Date.now() })
  cerrarModalProspecto()
}

// --- CONTADORES TOTALES ---
const totalProspectos = computed(() => {
  return props.contactosFiltrados.filter(c => c.estadoLead === 'Prospecto').length
})

// --- CONTROL DE MENÚS FILTROS ---
const filtrosAbiertos = ref(false)
const subMenuActivo = ref<'rol' | 'estado' | 'origen' | 'campana' | 'edad' | null>(null)
const menuTop = ref(0)
const menuLeft = ref(0)

const alternarMenuPrincipal = (event: MouseEvent) => {
  filtrosAbiertos.value = !filtrosAbiertos.value
  if (filtrosAbiertos.value) {
    subMenuActivo.value = null 
    const target = event.currentTarget as HTMLElement
    if (target) {
      const rect = target.getBoundingClientRect()
      menuTop.value = rect.top
      menuLeft.value = rect.right + 8 
    }
  }
}

const clickAfueraDetectado = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (filtrosAbiertos.value && !target.closest('.btn-ajustes-trigger') && !target.closest('.panel-flotante-root')) {
    filtrosAbiertos.value = false
    subMenuActivo.value = null
  }
  if (cargaMasivaAbierta.value && !target.closest('.btn-carga-trigger') && !target.closest('.panel-carga-flotante')) {
    cargaMasivaAbierta.value = false
  }
}

onMounted(() => document.addEventListener('click', clickAfueraDetectado))
onUnmounted(() => document.removeEventListener('click', clickAfueraDetectado))

const conteoFiltrosActivos = computed(() => {
  let activos = 0
  if (filtroRolLocal.value !== 'todos') activos++
  if (filtroEstadoLocal.value !== 'todos') activos++
  if (filtroOrigenLocal.value !== 'todos') activos++
  if (filtroCampanaLocal.value !== 'todos') activos++
  if (filtroEdadLocal.value !== 'todos') activos++
  return activos
})

// --- WATCHERS DE SINCRONIZACIÓN ---
const busquedaLocal = ref(props.busqueda)
const filtroRolLocal = ref(props.filtroRol)
const filtroEstadoLocal = ref(props.filtroEstado)
const filtroOrigenLocal = ref(props.filtroOrigen)
const filtroCampanaLocal = ref(props.filtroCampana)
const filtroEdadLocal = ref(props.filtroEdad)

watch(() => props.busqueda, (val) => busquedaLocal.value = val)
watch(() => props.filtroRol, (val) => filtroRolLocal.value = val)
watch(() => props.filtroEstado, (val) => filtroEstadoLocal.value = val)
watch(() => props.filtroOrigen, (val) => filtroOrigenLocal.value = val)
watch(() => props.filtroCampana, (val) => filtroCampanaLocal.value = val)
watch(() => props.filtroEdad, (val) => filtroEdadLocal.value = val)

watch(busquedaLocal, (val) => emit('update:busqueda', val))
watch(filtroRolLocal, (val) => emit('update:filtroRol', val))
watch(filtroEstadoLocal, (val) => emit('update:filtroEstado', val))
watch(filtroOrigenLocal, (val) => emit('update:filtroOrigen', val))
watch(filtroCampanaLocal, (val) => emit('update:filtroCampana', val))
watch(filtroEdadLocal, (val) => emit('update:filtroEdad', val))

const contactosRenderizados = computed(() => {
  if (filtroEstadoLocal.value === 'Prospecto') {
    return props.contactosFiltrados.filter(c => c.estadoLead === 'Prospecto')
  }
  return props.contactosFiltrados
})
</script>

<template>
  <div class="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center shrink-0 rounded-t-xl relative z-10">
    <span class="text-[10px] font-black uppercase text-slate-500 tracking-widest">Bandeja de Inteligencia</span>
    <span class="text-[10px] bg-blue-700 text-white font-mono px-2 py-0.5 rounded-md font-black shadow-xs">
      {{ contactosRenderizados.length }}
    </span>
  </div>

  <div class="p-3 bg-white border-b border-slate-100 shrink-0 relative z-20 space-y-2">
    <div class="flex gap-2">
      <div class="relative flex-1">
        <input 
          v-model="busquedaLocal" type="text" placeholder="Buscar Cédula, Nombre..." 
          class="w-full bg-slate-50 text-slate-900 placeholder-slate-400 rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all shadow-inner" 
        />
      </div>
      
      <button 
        type="button" @click="modalAgregarAbierto = true" title="Agregar Nuevo Prospecto"
        class="h-full px-3 bg-blue-600 text-white hover:bg-blue-700 active:scale-95 rounded-lg text-xs font-black transition-all flex items-center justify-center cursor-pointer select-none shrink-0 shadow-sm border border-blue-700"
      >
        <span>➕</span>
      </button>

      <button 
        type="button" @click="alternarMenuPrincipal"
        :class="['btn-ajustes-trigger h-full px-2.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none shrink-0', filtrosAbiertos || conteoFiltrosActivos > 0 ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100']"
      >
        <span>⚙️</span>
        <span v-if="conteoFiltrosActivos > 0" class="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none">
          {{ conteoFiltrosActivos }}
        </span>
        <span class="text-[8px] font-mono transition-transform duration-200" :class="{ 'rotate-180': filtrosAbiertos }">▼</span>
      </button>
    </div>

    <div class="flex border border-slate-200/60 p-0.5 bg-slate-50 rounded-lg gap-0.5">
      <button 
        @click="filtroEstadoLocal = 'todos'"
        :class="['flex-1 py-1.5 px-2 rounded-md text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5', filtroEstadoLocal !== 'Prospecto' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800']"
      >
        <span>Contactos</span>
        <span :class="['px-1.5 py-0.5 font-mono text-[9px] rounded-md font-bold', filtroEstadoLocal !== 'Prospecto' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600']">
          {{ contactosFiltrados.length }}
        </span>
      </button>

      <button 
        @click="filtroEstadoLocal = 'Prospecto'"
        :class="['flex-1 py-1.5 px-2 rounded-md text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5', filtroEstadoLocal === 'Prospecto' ? 'bg-white text-amber-700 shadow-xs border border-slate-100' : 'text-slate-500 hover:text-slate-800']"
      >
        <span>Prospectos</span>
        <span :class="['px-1.5 py-0.5 font-mono text-[9px] rounded-md font-bold', filtroEstadoLocal === 'Prospecto' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600']">
          {{ totalProspectos }}
        </span>
      </button>
    </div>
  </div>

  <div class="px-3 pt-2 pb-1 shrink-0 bg-white">
    <div 
      @click="alternarCargaMasiva"
      :class="['btn-carga-trigger w-full flex justify-between items-center py-2 px-3 border rounded-xl cursor-pointer select-none transition-all text-left', cargaMasivaAbierta ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold shadow-xs' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50']"
    >
      <span class="text-[11px] font-black uppercase tracking-wider">Carga Masiva de Archivos</span>
      <span class="text-[10px] font-mono">
        {{ cargaMasivaAbierta ? '◀' : '▶' }}
      </span>
    </div>
  </div>

  <div class="flex-1 divide-y divide-slate-100 overflow-y-auto relative z-10">
    <div 
      v-for="contacto in contactosRenderizados" :key="contacto.idUnico" @click="emit('seleccionar', contacto)"
      :class="['p-3.5 cursor-pointer transition-all border-l-4 relative', (modoVista === 'particular' && contactoSeleccionado?.idUnico === contacto.idUnico) ? 'bg-blue-50/50 border-pink-500' : 'border-transparent hover:bg-slate-50/80']"
    >
      <div class="flex justify-between items-start gap-2">
        <div class="min-w-0">
          <h4 class="font-black text-xs text-slate-900 truncate tracking-tight">{{ contacto.nombreCompleto }}</h4>
          <div class="flex items-center gap-1.5 mt-1">
            <span class="text-[10px] text-slate-400 font-medium tracking-wide">{{ contacto.campana }}</span>
            <span v-if="contacto.estadoLead === 'Prospecto'" class="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-px rounded font-black uppercase tracking-tight">
              {{ contacto.estadoLead }}
            </span>
          </div>
        </div>
        <span class="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[9px] font-black uppercase shrink-0 tracking-wider">
          {{ contacto.rol }}
        </span>
      </div>
    </div>
  </div>

 <Teleport to="body">
  <div 
    v-if="cargaMasivaAbierta" 
    class="panel-carga-flotante fixed z-[99999] bg-white rounded-xl border border-slate-200/90 shadow-2xl p-3 w-[295px] space-y-2 text-left animate-in fade-in slide-in-from-left-2 duration-150"
    :style="{ top: `${cargaTop}px`, left: `${cargaLeft}px` }"
  >
    <div class="flex justify-between items-center pb-2 border-b border-slate-100 mb-1">
      <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Opciones de Importación</span>
      <button @click="cargaMasivaAbierta = false" class="text-slate-400 hover:text-slate-600 text-xs font-black px-1 rounded cursor-pointer">✕</button>
    </div>

    <div class="border border-slate-200/70 rounded-xl p-2.5 bg-white">
      <div class="flex justify-between items-center mb-1.5">
        <span class="text-xs font-black text-slate-700">Titulares</span>
        <button @click="seccionActiva = seccionActiva === 'titulares' ? null : 'titulares'" class="text-[10px] text-blue-600 font-bold">
          {{ seccionActiva === 'titulares' ? 'Ocultar' : 'Configurar' }}
        </button>
      </div>
      <div v-if="seccionActiva === 'titulares'" class="space-y-2 pt-1">
        <div class="flex items-center justify-between gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
          <span class="text-[10px] text-slate-500 font-bold">Acción inicial:</span>
          <select v-model="accionTitularesUnicos" class="bg-white text-slate-800 text-[11px] font-bold rounded-md border border-slate-200 px-2 py-0.5 focus:outline-none">
            <option value="Activar">Activar</option>
            <option value="Desactivar">Desactivar</option>
          </select>
        </div>
        <label class="w-full flex items-center justify-center bg-[#00965e] hover:bg-[#008252] text-white font-black text-[10px] py-2 px-3 rounded-lg cursor-pointer text-center shadow-xs">
          SUBIR ARCHIVO XLSX
          <input type="file" accept=".xlsx, .xls" class="hidden" @change="manejarArchivo($event, 'titulares')" />
        </label>
        <button type="button" @click="emit('descargarPlantilla', 'titulares')" class="w-full bg-[#f0f4f9] hover:bg-[#e4eafd] text-[#0033a0] font-black text-[10px] py-2 px-3 rounded-lg border border-slate-100 text-center">
          DESCARGAR PLANTILLA BASE
        </button>
      </div>
    </div>

    <div class="border border-slate-200/70 rounded-xl p-2.5 bg-white">
      <div class="flex justify-between items-center mb-1.5">
        <span class="text-xs font-black text-slate-700">Beneficiarios</span>
        <button @click="seccionActiva = seccionActiva === 'beneficiarios' ? null : 'beneficiarios'" class="text-[10px] text-blue-600 font-bold">
          {{ seccionActiva === 'beneficiarios' ? 'Ocultar' : 'Configurar' }}
        </button>
      </div>
      <div v-if="seccionActiva === 'beneficiarios'" class="space-y-2 pt-1">
        <div class="flex items-center justify-between gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
          <span class="text-[10px] text-slate-500 font-bold">Acción:</span>
          <select v-model="accionDocumento" class="bg-white text-slate-800 text-[11px] font-bold rounded-md border border-slate-200 px-2 py-0.5 focus:outline-none">
            <option value="Activar">Activar</option>
            <option value="Desactivar">Desactivar</option>
          </select>
        </div>
        <label class="w-full flex items-center justify-center bg-[#00965e] hover:bg-[#008252] text-white font-black text-[10px] py-2 px-3 rounded-lg cursor-pointer text-center shadow-xs">
          SUBIR ARCHIVO XLSX
          <input type="file" accept=".xlsx, .xls" class="hidden" @change="manejarArchivo($event, 'beneficiarios')" />
        </label>
        <button type="button" @click="emit('descargarPlantilla', 'beneficiarios')" class="w-full bg-[#f0f4f9] hover:bg-[#e4eafd] text-[#0033a0] font-black text-[10px] py-2 px-3 rounded-lg border border-slate-100 text-center">
          DESCARGAR PLANTILLA BASE
        </button>
      </div>
    </div>

    <div class="border border-slate-200/70 rounded-xl p-2.5 bg-white">
      <div class="flex justify-between items-center mb-1.5">
        <span class="text-xs font-black text-slate-700">Inscripción</span>
        <button @click="seccionActiva = seccionActiva === 'inscripcion' ? null : 'inscripcion'" class="text-[10px] text-blue-600 font-bold">
          {{ seccionActiva === 'inscripcion' ? 'Ocultar' : 'Configurar' }}
        </button>
      </div>
      
      <div v-if="seccionActiva === 'inscripcion'" class="space-y-2 pt-1">
        <div class="flex items-center justify-between gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
  
        </div>

        <div class="flex items-center justify-between gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
          <div class="flex flex-col">
            <span class="text-[10px] text-slate-700 font-black">Cupos por Inscripción:</span>
            <span class="text-[8px] text-slate-400 font-medium">Límite permitido por archivo</span>
          </div>
          <select v-model="maxPersonasInscripcion" class="bg-white text-slate-800 text-[11px] font-bold rounded-md border border-slate-200 px-2 py-0.5 focus:outline-none">
            <option :value="1">1 Persona</option>
            <option :value="2">2 Personas</option>
            <option :value="3">3 Personas</option>
            <option :value="4">4 Personas</option>
            <option :value="5">5 Personas (Máx)</option>
          </select>
        </div>

        <label class="w-full flex items-center justify-center bg-[#00965e] hover:bg-[#008252] text-white font-black text-[10px] py-2 px-3 rounded-lg cursor-pointer text-center shadow-xs">
          SUBIR ARCHIVO XLSX
          <input type="file" accept=".xlsx, .xls" class="hidden" @change="manejarArchivo($event, 'inscripcion')" />
        </label>

        <button type="button" @click="emit('descargarPlantilla', 'inscripcion')" class="w-full bg-[#f0f4f9] hover:bg-[#e4eafd] text-[#0033a0] font-black text-[10px] py-2 px-3 rounded-lg border border-slate-100 text-center">
          DESCARGAR PLANTILLA BASE
        </button>
      </div>
    </div>

    <div class="border border-slate-200/70 rounded-xl p-2.5 bg-white">
      <div class="flex justify-between items-center mb-1.5">
        <span class="text-xs font-black text-slate-700">Remplazo</span>
        <button @click="seccionActiva = seccionActiva === 'remplazo' ? null : 'remplazo'" class="text-[10px] text-blue-600 font-bold">
          {{ seccionActiva === 'remplazo' ? 'Ocultar' : 'Configurar' }}
        </button>
      </div>
      <div v-if="seccionActiva === 'remplazo'" class="pt-1 space-y-2">
        <label class="w-full flex items-center justify-center bg-[#00965e] hover:bg-[#008252] text-white font-black text-[10px] py-2 px-3 rounded-lg cursor-pointer text-center shadow-xs">
          SUBIR ARCHIVO XLSX
          <input type="file" accept=".xlsx, .xls" class="hidden" @change="manejarArchivo($event, 'remplazo')" />
        </label>
      </div>
    </div>
  </div>
</Teleport>
</template>