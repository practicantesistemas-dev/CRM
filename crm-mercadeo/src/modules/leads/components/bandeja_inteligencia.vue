<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'

// --- INTERFACES ---
interface ServicioParticular { nombre: string; fecha: string; estado: 'Activo' | 'Terminado'; }
interface Beneficiario { nombreCompleto: string; tipoDocumento: string; documento: string; edad: number; genero: string; telefono?: string; parentesco: string; }
interface Contacto { idUnico: string; nombreCompleto: string; rol: 'titular' | 'beneficiario' | 'proveedor' | 'empresa'; tipoDocumento: string; documento: string; telefono: string; whatsapp: string; email: string; ciudad: string; pais: string; canalOrigen: string; campana: string; estadoLead: string; ultimoContacto: string; proximoContacto: string; cantidadLlamadas: number; cantidadEmails: number; notes?: string; edad: number; genero: string; serviciosHistoricos: ServicioParticular[]; beneficiariosAsociados?: Beneficiario[]; categoria?: string; ocupacion?: string; fechaNacimiento?: string; cargo?: string; }

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
const accionTitularesUnicos = ref('Activar')     
const accionDocumento = ref('Activar')          
const accionTitularInscripcion = ref('Activar') 
const maxPersonasInscripcion = ref(5)           
const accionProveedores = ref('Activar') // NUEVO
const accionEmpresas = ref('Activar') // NUEVO

// --- ESTADO MENÚ DESPLEGABLE (CARGA MASIVA) ---
const cargaMasivaAbierta = ref(false)
const seccionActiva = ref<'titulares' | 'beneficiarios' | 'inscripcion' | 'remplazo' | 'proveedores' | 'empresas' | null>('titulares')

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
    } else if (seccion === 'proveedores') {
      accionFinal = accionProveedores.value
    } else if (seccion === 'empresas') {
      accionFinal = accionEmpresas.value
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

// --- ESTADO DEL MODAL AGREGAR PROSPECTO / REGISTROS ---
const modalAgregarAbierto = ref(false)
const tipoRegistro = ref<'contacto' | 'proveedor' | 'empresa'>('contacto') // Control dinámico del tipo de formulario

const nuevoProspecto = ref({
  nombreCompleto: '', 
  tipoDocumento: 'CC', 
  documento: '', 
  telefono: '', 
  whatsapp: '', 
  email: '', 
  canalOrigen: 'Llamada Directa', 
  campana: 'Registro Manual', 
  estadoLead: 'Prospecto', 
  rol: 'titular' as 'titular' | 'proveedor' | 'empresa',
  categoria: '',
  ocupacion: '',
  fechaNacimiento: '',
  cargo: ''
})

const abrirModalConTipo = (tipo: 'contacto' | 'proveedor' | 'empresa') => {
  tipoRegistro.value = tipo
  nuevoProspecto.value.rol = tipo === 'contacto' ? 'titular' : tipo
  nuevoProspecto.value.campana = tipo === 'contacto' ? 'Registro Manual' : `Alta Manual ${tipo}`
  modalAgregarAbierto.value = true
}

const cerrarModalProspecto = () => {
  modalAgregarAbierto.value = false
  nuevoProspecto.value = {
    nombreCompleto: '', tipoDocumento: 'CC', documento: '', telefono: '', whatsapp: '', email: '', canalOrigen: 'Llamada Directa', campana: 'Registro Manual', estadoLead: 'Prospecto', rol: 'titular',
    categoria: '', ocupacion: '', fechaNacimiento: '', cargo: ''
  }
}

const procesarGuardado = () => {
  if (!nuevoProspecto.value.nombreCompleto || !nuevoProspecto.value.documento) {
    alert('Por favor, ingresa al menos el Nombre/Razón Social y el Documento.')
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
const subMenuTop = ref(0)
const subMenuLeft = ref(0)

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

const abrirSubMenu = (event: MouseEvent, tipo: 'rol' | 'estado' | 'origen' | 'campana' | 'edad') => {
  if (subMenuActivo.value === tipo) {
    subMenuActivo.value = null
    return
  }
  subMenuActivo.value = tipo
  const target = event.currentTarget as HTMLElement
  if (target) {
    const rect = target.getBoundingClientRect()
    subMenuTop.value = rect.top - 4 
    subMenuLeft.value = rect.right + 8 
  }
}

const clickAfueraDetectado = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (filtrosAbiertos.value && !target.closest('.btn-ajustes-trigger') && !target.closest('.panel-flotante-root') && !target.closest('.panel-sub-flotante')) {
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

// Textos legibles dinámicos
const textoRolActivo = computed(() => {
  if (filtroRolLocal.value === 'titular') return 'Titulares'
  if (filtroRolLocal.value === 'beneficiario') return 'Beneficiarios'
  if (filtroRolLocal.value === 'proveedor') return 'Proveedores'
  if (filtroRolLocal.value === 'empresa') return 'Empresas'
  return 'Filtrar por Rol'
})

const textoEstadoActivo = computed(() => {
  if (filtroEstadoLocal.value === 'Prospecto') return 'Solo Prospectos'
  if (filtroEstadoLocal.value === 'Cliente') return 'Solo Clientes'
  return 'Filtrar por Estado'
})

const textoOrigenActivo = computed(() => {
  if (filtroOrigenLocal.value === 'todos') return 'Canal de Origen'
  return filtroOrigenLocal.value
})

const textoCampanaActiva = computed(() => {
  if (filtroCampanaLocal.value === 'todos') return 'Filtrar Campaña'
  if (filtroCampanaLocal.value === 'Registro Manual') return 'Manual'
  if (filtroCampanaLocal.value === 'Campaña Black Friday') return 'Black Friday'
  return 'Orgánica'
})

const textoEdadActiva = computed(() => {
  if (filtroEdadLocal.value === 'menores') return 'Menores (< 18)'
  if (filtroEdadLocal.value === 'adultos') return 'Adultos (18 - 60)'
  if (filtroEdadLocal.value === 'mayores') return 'Mayores (> 60)'
  return 'Rango de Edad'
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
      
      <div class="relative group shrink-0">
        <button 
          type="button" title="Agregar Registro Manual"
          class="h-full px-3 bg-blue-600 text-white hover:bg-blue-700 active:scale-95 rounded-lg text-xs font-black transition-all flex items-center justify-center cursor-pointer select-none shadow-sm border border-blue-700"
        >
          <span>➕</span>
        </button>
        <div class="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl hidden group-hover:block z-50 py-1 overflow-hidden animate-in fade-in duration-100">
          <button @click="abrirModalConTipo('contacto')" class="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2">👤 Nuevo Contacto</button>
          <button @click="abrirModalConTipo('proveedor')" class="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2">📦 Nuevo Proveedor</button>
          <button @click="abrirModalConTipo('empresa')" class="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2">🏢 Nueva Empresa</button>
        </div>
      </div>

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

  <div v-if="modalAgregarAbierto" class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-[100000] p-4 animate-in fade-in duration-200">
    <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden text-left animate-in zoom-in-95 duration-150">
      <div class="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <span class="text-xs font-black uppercase text-slate-600 tracking-wider">Añadir Nuevo {{ tipoRegistro.toUpperCase() }}</span>
        <button @click="cerrarModalProspecto" class="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer">✕</button>
      </div>
      
      <div class="p-4 space-y-3 max-h-[80vh] overflow-y-auto">
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-black uppercase text-slate-400 tracking-wide">Nombre Completo / Razón Social</label>
          <input v-model="nuevoProspecto.nombreCompleto" type="text" class="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600" placeholder="Ej. Carlos Mendoza o Distribuidora S.A.S" />
        </div>

        <div class="grid grid-cols-3 gap-2">
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-black uppercase text-slate-400 tracking-wide">Tipo Doc</label>
            <select v-model="nuevoProspecto.tipoDocumento" class="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none">
              <option value="CC">CC</option>
              <option value="NIT">NIT</option>
              <option value="CE">CE</option>
              <option value="PP">Pasaporte</option>
            </select>
          </div>
          <div class="flex flex-col gap-1 col-span-2">
            <label class="text-[10px] font-black uppercase text-slate-400 tracking-wide">Documento / Identificación</label>
            <input v-model="nuevoProspecto.documento" type="text" class="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none" placeholder="Número de documento" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-black uppercase text-slate-400 tracking-wide">Categoría</label>
            <input v-model="nuevoProspecto.categoria" type="text" class="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none" placeholder="Ej. VIP, Recurrente" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-black uppercase text-slate-400 tracking-wide">Ocupación</label>
            <input v-model="nuevoProspecto.ocupacion" type="text" class="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none" placeholder="Ej. Ingeniero, Médico" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-black uppercase text-slate-400 tracking-wide">Fecha de Nacimiento</label>
            <input v-model="nuevoProspecto.fechaNacimiento" type="date" class="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-black uppercase text-slate-400 tracking-wide">Cargo / Posición</label>
            <input v-model="nuevoProspecto.cargo" type="text" class="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none" placeholder="Ej. Director de Compras" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-black uppercase text-slate-400 tracking-wide">Teléfono</label>
            <input v-model="nuevoProspecto.telefono" type="text" class="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none" placeholder="Móvil" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-black uppercase text-slate-400 tracking-wide">WhatsApp</label>
            <input v-model="nuevoProspecto.whatsapp" type="text" class="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none" placeholder="Link de WhatsApp" />
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-black uppercase text-slate-400 tracking-wide">Correo Electrónico</label>
          <input v-model="nuevoProspecto.email" type="email" class="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none" placeholder="correo@ejemplo.com" />
        </div>
      </div>

      <div class="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
        <button @click="cerrarModalProspecto" class="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer">Cancelar</button>
        <button @click="procesarGuardado" class="px-3 py-1.5 rounded-lg bg-blue-600 border border-blue-700 text-xs font-black text-white hover:bg-blue-700 cursor-pointer shadow-xs">Guardar e Inyectar</button>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div 
      v-if="cargaMasivaAbierta" 
      class="panel-carga-flotante fixed z-[99999] bg-white rounded-xl border border-slate-200/90 shadow-2xl p-3 w-[295px] max-h-[85vh] overflow-y-auto space-y-2 text-left animate-in fade-in slide-in-from-left-2 duration-150"
      :style="{ top: `${cargaTop}px`, left: `${cargaLeft}px` }"
    >
      <div class="flex justify-between items-center pb-2 border-b border-slate-100 mb-1">
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Opciones de Importación Masiva</span>
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
          <span class="text-xs font-black text-slate-700">📦 Carga Proveedores</span>
          <button @click="seccionActiva = seccionActiva === 'proveedores' ? null : 'proveedores'" class="text-[10px] text-blue-600 font-bold">
            {{ seccionActiva === 'proveedores' ? 'Ocultar' : 'Configurar' }}
          </button>
        </div>
        <div v-if="seccionActiva === 'proveedores'" class="space-y-2 pt-1">
          <div class="flex items-center justify-between gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
            <span class="text-[10px] text-slate-500 font-bold">Estado Inicial:</span>
            <select v-model="accionProveedores" class="bg-white text-slate-800 text-[11px] font-bold rounded-md border border-slate-200 px-2 py-0.5 focus:outline-none">
              <option value="Activar">Activo</option>
              <option value="Desactivar">Inactivo</option>
            </select>
          </div>
          <label class="w-full flex items-center justify-center bg-[#0033a0] hover:bg-[#002270] text-white font-black text-[10px] py-2 px-3 rounded-lg cursor-pointer text-center shadow-xs">
            CARGAR PROVEEDORES (.XLSX)
            <input type="file" accept=".xlsx, .xls" class="hidden" @change="manejarArchivo($event, 'proveedores')" />
          </label>
        </div>
      </div>

      <div class="border border-slate-200/70 rounded-xl p-2.5 bg-white">
        <div class="flex justify-between items-center mb-1.5">
          <span class="text-xs font-black text-slate-700">🏢 Carga Empresas</span>
          <button @click="seccionActiva = seccionActiva === 'empresas' ? null : 'empresas'" class="text-[10px] text-blue-600 font-bold">
            {{ seccionActiva === 'empresas' ? 'Ocultar' : 'Configurar' }}
          </button>
        </div>
        <div v-if="seccionActiva === 'empresas'" class="space-y-2 pt-1">
          <div class="flex items-center justify-between gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
            <span class="text-[10px] text-slate-500 font-bold">Estado B2B:</span>
            <select v-model="accionEmpresas" class="bg-white text-slate-800 text-[11px] font-bold rounded-md border border-slate-200 px-2 py-0.5 focus:outline-none">
              <option value="Activar">Activo</option>
              <option value="Desactivar">Inactivo</option>
            </select>
          </div>
          <label class="w-full flex items-center justify-center bg-[#0033a0] hover:bg-[#002270] text-white font-black text-[10px] py-2 px-3 rounded-lg cursor-pointer text-center shadow-xs">
            CARGAR EMPRESAS (.XLSX)
            <input type="file" accept=".xlsx, .xls" class="hidden" @change="manejarArchivo($event, 'empresas')" />
          </label>
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

  <div 
    v-if="filtrosAbiertos" 
    class="panel-flotante-root fixed z-[99999] bg-white rounded-xl border border-slate-200/90 shadow-2xl p-2 w-[210px] text-left animate-in fade-in slide-in-from-left-2 duration-150 space-y-0.5"
    :style="{ top: `${menuTop}px`, left: `${menuLeft}px` }"
  >
    <div class="px-2 py-1.5 border-b border-slate-100 mb-1 flex justify-between items-center">
      <span class="text-[9px] font-black uppercase text-slate-400 tracking-wider">Filtros Avanzados</span>
      <button @click="filtrosAbiertos = false; subMenuActivo = null" class="text-slate-400 hover:text-slate-600 text-xs font-black">✕</button>
    </div>

    <button @click="abrirSubMenu($event, 'rol')" :class="['w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold flex justify-between items-center transition-all cursor-pointer', subMenuActivo === 'rol' ? 'bg-blue-600 text-white shadow-sm font-extrabold' : 'text-slate-700 hover:bg-slate-100', filtroRolLocal !== 'todos' && subMenuActivo !== 'rol' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100/50' : '']">
      <span class="truncate">{{ textoRolActivo }}</span>
      <span class="text-[9px] font-mono opacity-50" :class="{ 'text-white/80': subMenuActivo === 'rol' }">▶</span>
    </button>

    <button @click="abrirSubMenu($event, 'estado')" :class="['w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold flex justify-between items-center transition-all cursor-pointer', subMenuActivo === 'estado' ? 'bg-blue-600 text-white shadow-sm font-extrabold' : 'text-slate-700 hover:bg-slate-100', filtroEstadoLocal !== 'todos' && subMenuActivo !== 'estado' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100/50' : '']">
      <span class="truncate">{{ textoEstadoActivo }}</span>
      <span class="text-[9px] font-mono opacity-50" :class="{ 'text-white/80': subMenuActivo === 'estado' }">▶</span>
    </button>

    <button @click="abrirSubMenu($event, 'origen')" :class="['w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold flex justify-between items-center transition-all cursor-pointer', subMenuActivo === 'origen' ? 'bg-blue-600 text-white shadow-sm font-extrabold' : 'text-slate-700 hover:bg-slate-100', filtroOrigenLocal !== 'todos' && subMenuActivo !== 'origen' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100/50' : '']">
      <span class="truncate">{{ textoOrigenActivo }}</span>
      <span class="text-[9px] font-mono opacity-50" :class="{ 'text-white/80': subMenuActivo === 'origen' }">▶</span>
    </button>

    <button @click="abrirSubMenu($event, 'campana')" :class="['w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold flex justify-between items-center transition-all cursor-pointer', subMenuActivo === 'campana' ? 'bg-blue-600 text-white shadow-sm font-extrabold' : 'text-slate-700 hover:bg-slate-100', filtroCampanaLocal !== 'todos' && subMenuActivo !== 'campana' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100/50' : '']">
      <span class="truncate">{{ textoCampanaActiva }}</span>
      <span class="text-[9px] font-mono opacity-50" :class="{ 'text-white/80': subMenuActivo === 'campana' }">▶</span>
    </button>

    <button @click="abrirSubMenu($event, 'edad')" :class="['w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold flex justify-between items-center transition-all cursor-pointer', subMenuActivo === 'edad' ? 'bg-blue-600 text-white shadow-sm font-extrabold' : 'text-slate-700 hover:bg-slate-100', filtroEdadLocal !== 'todos' && subMenuActivo !== 'edad' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100/50' : '']">
      <span class="truncate">{{ textoEdadActiva }}</span>
      <span class="text-[9px] font-mono opacity-50" :class="{ 'text-white/80': subMenuActivo === 'edad' }">▶</span>
    </button>
  </div>

  <div 
    v-if="filtrosAbiertos && subMenuActivo"
    class="panel-sub-flotante fixed z-[100000] bg-white rounded-xl border border-slate-200/90 shadow-2xl p-1 w-[180px] text-left animate-in fade-in slide-in-from-left-1 duration-100 space-y-px"
    :style="{ top: `${subMenuTop}px`, left: `${subMenuLeft}px` }"
  >
    <template v-if="subMenuActivo === 'rol'">
      <button @click="filtroRolLocal = 'todos'; subMenuActivo = null" :class="['w-full text-left px-2.5 py-1.5 text-[11px] rounded-md transition-all font-medium cursor-pointer', filtroRolLocal === 'todos' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50']">Todos los Roles</button>
      <button @click="filtroRolLocal = 'titular'; subMenuActivo = null" :class="['w-full text-left px-2.5 py-1.5 text-[11px] rounded-md transition-all font-medium cursor-pointer', filtroRolLocal === 'titular' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50']">Titulares</button>
      <button @click="filtroRolLocal = 'beneficiario'; subMenuActivo = null" :class="['w-full text-left px-2.5 py-1.5 text-[11px] rounded-md transition-all font-medium cursor-pointer', filtroRolLocal === 'beneficiario' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50']">Beneficiarios</button>
      <button @click="filtroRolLocal = 'proveedor'; subMenuActivo = null" :class="['w-full text-left px-2.5 py-1.5 text-[11px] rounded-md transition-all font-medium cursor-pointer', filtroRolLocal === 'proveedor' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50']">Proveedores</button>
      <button @click="filtroRolLocal = 'empresa'; subMenuActivo = null" :class="['w-full text-left px-2.5 py-1.5 text-[11px] rounded-md transition-all font-medium cursor-pointer', filtroRolLocal === 'empresa' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50']">Empresas</button>
    </template>

    <template v-if="subMenuActivo === 'estado'">
      <button @click="filtroEstadoLocal = 'todos'; subMenuActivo = null" :class="['w-full text-left px-2.5 py-1.5 text-[11px] rounded-md transition-all font-medium cursor-pointer', filtroEstadoLocal === 'todos' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50']">Todos los Estados</button>
      <button @click="filtroEstadoLocal = 'Prospecto'; subMenuActivo = null" :class="['w-full text-left px-2.5 py-1.5 text-[11px] rounded-md transition-all font-medium cursor-pointer', filtroEstadoLocal === 'Prospecto' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50']">Solo Prospectos</button>
      <button @click="filtroEstadoLocal = 'Cliente'; subMenuActivo = null" :class="['w-full text-left px-2.5 py-1.5 text-[11px] rounded-md transition-all font-medium cursor-pointer', filtroEstadoLocal === 'Cliente' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50']">Solo Clientes</button>
    </template>

    <template v-if="subMenuActivo === 'origen'">
      <button @click="filtroOrigenLocal = 'todos'; subMenuActivo = null" :class="['w-full text-left px-2.5 py-1.5 text-[11px] rounded-md transition-all font-medium cursor-pointer', filtroOrigenLocal === 'todos' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50']">Todos los Orígenes</button>
      <button @click="filtroOrigenLocal = 'Llamada Directa'; subMenuActivo = null" :class="['w-full text-left px-2.5 py-1.5 text-[11px] rounded-md transition-all font-medium cursor-pointer', filtroOrigenLocal === 'Llamada Directa' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50']">Llamada Directa</button>
      <button @click="filtroOrigenLocal = 'Formulario Web'; subMenuActivo = null" :class="['w-full text-left px-2.5 py-1.5 text-[11px] rounded-md transition-all font-medium cursor-pointer', filtroOrigenLocal === 'Formulario Web' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50']">Formulario Web</button>
      <button @click="filtroOrigenLocal = 'WhatsApp'; subMenuActivo = null" :class="['w-full text-left px-2.5 py-1.5 text-[11px] rounded-md transition-all font-medium cursor-pointer', filtroOrigenLocal === 'WhatsApp' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50']">WhatsApp</button>
    </template>

    <template v-if="subMenuActivo === 'campana'">
      <button @click="filtroCampanaLocal = 'todos'; subMenuActivo = null" :class="['w-full text-left px-2.5 py-1.5 text-[11px] rounded-md transition-all font-medium cursor-pointer', filtroCampanaLocal === 'todos' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50']">Todas las Campañas</button>
      <button @click="filtroCampanaLocal = 'Registro Manual'; subMenuActivo = null" :class="['w-full text-left px-2.5 py-1.5 text-[11px] rounded-md transition-all font-medium cursor-pointer', filtroCampanaLocal === 'Registro Manual' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50']">Registro Manual</button>
      <button @click="filtroCampanaLocal = 'Campaña Black Friday'; subMenuActivo = null" :class="['w-full text-left px-2.5 py-1.5 text-[11px] rounded-md transition-all font-medium cursor-pointer', filtroCampanaLocal === 'Campaña Black Friday' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50']">Black Friday</button>
      <button @click="filtroCampanaLocal = 'Inscripción Orgánica'; subMenuActivo = null" :class="['w-full text-left px-2.5 py-1.5 text-[11px] rounded-md transition-all font-medium cursor-pointer', filtroCampanaLocal === 'Inscripción Orgánica' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50']">Inscripción Orgánica</button>
    </template>

    <template v-if="subMenuActivo === 'edad'">
      <button @click="filtroEdadLocal = 'todos'; subMenuActivo = null" :class="['w-full text-left px-2.5 py-1.5 text-[11px] rounded-md transition-all font-medium cursor-pointer', filtroEdadLocal === 'todos' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50']">Todas las Edades</button>
      <button @click="filtroEdadLocal = 'menores'; subMenuActivo = null" :class="['w-full text-left px-2.5 py-1.5 text-[11px] rounded-md transition-all font-medium cursor-pointer', filtroEdadLocal === 'menores' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50']">Menores (&lt; 18)</button>
      <button @click="filtroEdadLocal = 'adultos'; subMenuActivo = null" :class="['w-full text-left px-2.5 py-1.5 text-[11px] rounded-md transition-all font-medium cursor-pointer', filtroEdadLocal === 'adultos' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50']">Adultos (18 - 60)</button>
      <button @click="filtroEdadLocal = 'mayores'; subMenuActivo = null" :class="['w-full text-left px-2.5 py-1.5 text-[11px] rounded-md transition-all font-medium cursor-pointer', filtroEdadLocal === 'mayores' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50']">Adultos Mayores (&gt; 60)</button>
    </template>
  </div>
</template>