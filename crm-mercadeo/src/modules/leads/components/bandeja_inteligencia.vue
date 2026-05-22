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
}>()

// --- ESTADO DEL MODAL AGREGAR PROSPECTO ---
const modalAgregarAbierto = ref(false)
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
  rol: 'titular' as 'titular'
})

const cerrarModalProspecto = () => {
  modalAgregarAbierto.value = false
  nuevoProspecto.value = {
    nombreCompleto: '',
    tipoDocumento: 'CC',
    documento: '',
    telefono: '',
    whatsapp: '',
    email: '',
    canalOrigen: 'Llamada Directa',
    campana: 'Registro Manual',
    estadoLead: 'Prospecto',
    rol: 'titular'
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

// --- WATCHERS DE SINCRONIZACIÓN (V-MODEL) ---
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

// --- COMPUTED FINAL PARA LA LISTA ---
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
          v-model="busquedaLocal" 
          type="text" 
          placeholder="Buscar Cédula, Nombre..." 
          class="w-full bg-slate-50 text-slate-900 placeholder-slate-400 rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all shadow-inner" 
        />
      </div>
      
      <button 
        type="button"
        @click="modalAgregarAbierto = true"
        title="Agregar Nuevo Prospecto"
        class="h-full px-3 bg-blue-600 text-white hover:bg-blue-700 active:scale-95 rounded-lg text-xs font-black transition-all flex items-center justify-center cursor-pointer select-none shrink-0 shadow-sm border border-blue-700"
      >
        <span>➕</span>
      </button>

      <button 
        type="button"
        @click="alternarMenuPrincipal"
        :class="[
          'btn-ajustes-trigger h-full px-2.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none shrink-0',
          filtrosAbiertos || conteoFiltrosActivos > 0 
            ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-xs' 
            : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
        ]"
      >
        <span>⚙️</span>
        <span v-if="conteoFiltrosActivos > 0" class="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none">
          {{ conteoFiltrosActivos }}
        </span>
        <span class="text-[8px] font-mono transition-transform duration-200" :class="{ 'rotate-180': filtrosAbiertos }">
          ▼
        </span>
      </button>
    </div>

    <div class="flex border border-slate-200/60 p-0.5 bg-slate-50 rounded-lg gap-0.5">
      <button 
        @click="filtroEstadoLocal = 'todos'"
        :class="[
          'flex-1 py-1.5 px-2 rounded-md text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5',
          filtroEstadoLocal !== 'Prospecto' 
            ? 'bg-white text-blue-700 shadow-xs' 
            : 'text-slate-500 hover:text-slate-800'
        ]"
      >
        <span>Contactos</span>
        <span :class="['px-1.5 py-0.5 font-mono text-[9px] rounded-md font-bold', filtroEstadoLocal !== 'Prospecto' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600']">
          {{ contactosFiltrados.length }}
        </span>
      </button>

      <button 
        @click="filtroEstadoLocal = 'Prospecto'"
        :class="[
          'flex-1 py-1.5 px-2 rounded-md text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5',
          filtroEstadoLocal === 'Prospecto' 
            ? 'bg-white text-amber-700 shadow-xs border border-slate-100' 
            : 'text-slate-500 hover:text-slate-800'
        ]"
      >
        <span>Prospectos</span>
        <span :class="['px-1.5 py-0.5 font-mono text-[9px] rounded-md font-bold', filtroEstadoLocal === 'Prospecto' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600']">
          {{ totalProspectos }}
        </span>
      </button>
    </div>
  </div>

  <Teleport to="body">
    <div v-if="modalAgregarAbierto" class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-[100000] p-4 select-none animate-in fade-in duration-200">
      <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-150">
        <div class="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="text-base">👤</span>
            <h3 class="text-xs font-black uppercase text-slate-700 tracking-wider">Registrar Nuevo Prospecto</h3>
          </div>
          <button @click="cerrarModalProspecto" class="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer">✕</button>
        </div>

        <div class="p-5 space-y-3.5 text-left">
          <div>
            <label class="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Nombre Completo *</label>
            <input v-model="nuevoProspecto.nombreCompleto" type="text" placeholder="Ej. Juan Pérez" class="w-full bg-slate-50 text-slate-900 rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600" />
          </div>

          <div class="grid grid-cols-3 gap-2">
            <div class="col-span-1">
              <label class="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Tipo Doc.</label>
              <select v-model="nuevoProspecto.tipoDocumento" class="w-full bg-slate-50 text-slate-900 rounded-lg border border-slate-200 px-2 py-2 text-xs focus:outline-none focus:bg-white">
                <option value="CC">C.C.</option>
                <option value="TI">T.I.</option>
                <option value="CE">C.E.</option>
                <option value="PAS">Pasaporte</option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Número Documento *</label>
              <input v-model="nuevoProspecto.documento" type="text" placeholder="Ej. 1023456" class="w-full bg-slate-50 text-slate-900 rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Teléfono</label>
              <input v-model="nuevoProspecto.telefono" type="text" placeholder="Opcional" class="w-full bg-slate-50 text-slate-900 rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:bg-white" />
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">WhatsApp</label>
              <input v-model="nuevoProspecto.whatsapp" type="text" placeholder="Ej. 3001234567" class="w-full bg-slate-50 text-slate-900 rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:bg-white" />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Correo Electrónico</label>
            <input v-model="nuevoProspecto.email" type="email" placeholder="juan@correo.com" class="w-full bg-slate-50 text-slate-900 rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:bg-white" />
          </div>

          <div>
            <label class="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Canal de Origen</label>
            <select v-model="nuevoProspecto.canalOrigen" class="w-full bg-slate-50 text-slate-900 rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:bg-white">
              <option value="Llamada Directa"> Llamada Directa</option>
              <option value="WhatsApp Directo"> WhatsApp Directo</option>
              <option value="Facebook Ads"> Facebook Ads</option>
              <option value="Google Ads"> Google Ads</option>
              <option value="Recomendado"> Recomendado Clínico</option>
            </select>
          </div>
        </div>

        <div class="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
          <button @click="cerrarModalProspecto" class="px-4 py-2 bg-white hover:bg-slate-100 text-slate-500 rounded-lg text-xs font-bold border border-slate-200 transition-all cursor-pointer">Cancelar</button>
          <button @click="procesarGuardado" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black transition-all shadow-xs cursor-pointer">Guardar Prospecto</button>
        </div>
      </div>
    </div>
  </Teleport>

  <Teleport to="body">
    <div v-if="filtrosAbiertos" class="panel-flotante-root fixed flex gap-2 z-[99999] pointer-events-auto items-start select-none animate-in fade-in slide-in-from-left-2 duration-150" :style="{ top: `${menuTop}px`, left: `${menuLeft}px` }">
      <div class="w-48 bg-white rounded-xl border border-slate-200/90 shadow-2xl p-1.5 space-y-0.5 shrink-0">
        <div class="flex justify-between items-center pb-1.5 px-2 border-b border-slate-100 mb-1">
          <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider">Filtros</span>
          <button @click="filtrosAbiertos = false; subMenuActivo = null" class="text-slate-400 hover:text-slate-600 text-xs font-bold px-1 rounded cursor-pointer">✕</button>
        </div>
        <button @click="subMenuActivo = 'rol'" :class="['w-full flex justify-between items-center py-2 px-2 rounded-lg text-left text-xs font-bold cursor-pointer transition-all', subMenuActivo === 'rol' ? 'bg-blue-50/70 text-blue-800' : 'text-slate-700 hover:bg-slate-50']">
          <span class="truncate">Tipo Contacto</span><span class="text-[9px] text-slate-400 font-mono">▶</span>
        </button>
        <button @click="subMenuActivo = 'estado'" :class="['w-full flex justify-between items-center py-2 px-2 rounded-lg text-left text-xs font-bold cursor-pointer transition-all', subMenuActivo === 'estado' ? 'bg-blue-50/70 text-blue-800' : 'text-slate-700 hover:bg-slate-50']">
          <span class="truncate">Estado Lead</span><span class="text-[9px] text-slate-400 font-mono">▶</span>
        </button>
        <button @click="subMenuActivo = 'origen'" :class="['w-full flex justify-between items-center py-2 px-2 rounded-lg text-left text-xs font-bold cursor-pointer transition-all', subMenuActivo === 'origen' ? 'bg-blue-50/70 text-blue-800' : 'text-slate-700 hover:bg-slate-50']">
          <span class="truncate">Canal Origen</span><span class="text-[9px] text-slate-400 font-mono">▶</span>
        </button>
        <button @click="subMenuActivo = 'campana'" :class="['w-full flex justify-between items-center py-2 px-2 rounded-lg text-left text-xs font-bold cursor-pointer transition-all', subMenuActivo === 'campana' ? 'bg-blue-50/70 text-blue-800' : 'text-slate-700 hover:bg-slate-50']">
          <span class="truncate">Campaña</span><span class="text-[9px] text-slate-400 font-mono">▶</span>
        </button>
        <button @click="subMenuActivo = 'edad'" :class="['w-full flex justify-between items-center py-2 px-2 rounded-lg text-left text-xs font-bold cursor-pointer transition-all', subMenuActivo === 'edad' ? 'bg-blue-50/70 text-blue-800' : 'text-slate-700 hover:bg-slate-50']">
          <span class="truncate">Segmento Edad</span><span class="text-[9px] text-slate-400 font-mono">▶</span>
        </button>
      </div>

      <div v-if="subMenuActivo" class="w-48 bg-white border border-slate-200/90 shadow-2xl rounded-xl p-1.5 space-y-0.5 shrink-0 animate-in fade-in slide-in-from-left-1 duration-100">
        <template v-if="subMenuActivo === 'rol'">
          <div @click="filtroRolLocal = 'todos'" class="py-1.5 px-2.5 hover:bg-slate-50 rounded-md flex justify-between cursor-pointer text-xs font-bold text-slate-600" :class="{'text-blue-700 bg-blue-50/60': filtroRolLocal === 'todos'}">Todos <span v-if="filtroRolLocal === 'todos'">✓</span></div>
          <div @click="filtroRolLocal = 'titular'" class="py-1.5 px-2.5 hover:bg-slate-50 rounded-md flex justify-between cursor-pointer text-xs font-bold text-slate-600" :class="{'text-blue-700 bg-blue-50/60': filtroRolLocal === 'titular'}">Titulares <span v-if="filtroRolLocal === 'titular'">✓</span></div>
          <div @click="filtroRolLocal = 'beneficiario'" class="py-1.5 px-2.5 hover:bg-slate-50 rounded-md flex justify-between cursor-pointer text-xs font-bold text-slate-600" :class="{'text-blue-700 bg-blue-50/60': filtroRolLocal === 'beneficiario'}">Beneficiarios <span v-if="filtroRolLocal === 'beneficiario'">✓</span></div>
        </template>

        <template v-if="subMenuActivo === 'estado'">
          <div v-for="opt in ['todos', 'Prospecto', 'Interesado', 'Cita Agendada', 'Cliente Cerrado']" :key="opt" @click="filtroEstadoLocal = opt" class="py-1.5 px-2.5 hover:bg-slate-50 rounded-md flex justify-between cursor-pointer text-xs font-bold text-slate-600" :class="{'text-blue-700 bg-blue-50/60': filtroEstadoLocal === opt}">
            {{ opt === 'todos' ? 'Todos los Estados' : opt }} <span v-if="filtroEstadoLocal === opt">✓</span>
          </div>
        </template>

        <template v-if="subMenuActivo === 'origen'">
          <div v-for="opt in ['todos', 'Facebook Ads', 'Google Ads', 'WhatsApp Directo']" :key="opt" @click="filtroOrigenLocal = opt" class="py-1.5 px-2.5 hover:bg-slate-50 rounded-md flex justify-between cursor-pointer text-xs font-bold text-slate-600" :class="{'text-blue-700 bg-blue-50/60': filtroOrigenLocal === opt}">
            {{ opt === 'todos' ? 'Todos' : opt }} <span v-if="filtroOrigenLocal === opt">✓</span>
          </div>
        </template>

        <template v-if="subMenuActivo === 'campana'">
          <div v-for="opt in ['todos', 'Estética Mayo', 'Ortodoncia']" :key="opt" @click="filtroCampanaLocal = opt" class="py-1.5 px-2.5 hover:bg-slate-50 rounded-md flex justify-between cursor-pointer text-xs font-bold text-slate-600" :class="{'text-blue-700 bg-blue-50/60': filtroCampanaLocal === opt}">
            {{ opt === 'todos' ? 'Todas' : opt }} <span v-if="filtroCampanaLocal === opt">✓</span>
          </div>
        </template>

        <template v-if="subMenuActivo === 'edad'">
          <div @click="filtroEdadLocal = 'todos'" class="py-1.5 px-2.5 hover:bg-slate-50 rounded-md flex justify-between cursor-pointer text-xs font-bold text-slate-600" :class="{'text-blue-700 bg-blue-50/60': filtroEdadLocal === 'todos'}">Cualquiera <span v-if="filtroEdadLocal === 'todos'">✓</span></div>
          <div @click="filtroEdadLocal = 'joven'" class="py-1.5 px-2.5 hover:bg-slate-50 rounded-md flex justify-between cursor-pointer text-xs font-bold text-slate-600" :class="{'text-blue-700 bg-blue-50/60': filtroEdadLocal === 'joven'}">Jóvenes (&lt; 25) <span v-if="filtroEdadLocal === 'joven'">✓</span></div>
          <div @click="filtroEdadLocal = 'adulto'" class="py-1.5 px-2.5 hover:bg-slate-50 rounded-md flex justify-between cursor-pointer text-xs font-bold text-slate-600" :class="{'text-blue-700 bg-blue-50/60': filtroEdadLocal === 'adulto'}">Adultos (25-50) <span v-if="filtroEdadLocal === 'adulto'">✓</span></div>
        </template>
      </div>
    </div>
  </Teleport>

  <div class="flex-1 divide-y divide-slate-100 overflow-y-auto relative z-10">
    <div 
      v-for="contacto in contactosRenderizados" 
      :key="contacto.idUnico" 
      @click="emit('seleccionar', contacto)"
      :class="['p-3.5 cursor-pointer transition-all border-l-4 relative', (modoVista === 'particular' && contactoSeleccionado?.idUnico === contacto.idUnico) ? 'bg-blue-50/50 border-pink-500' : 'border-transparent hover:bg-slate-50/80']"
    >
      <div class="flex justify-between items-start gap-2">
        <div class="min-w-0">
          <h4 class="font-black text-xs text-slate-900 truncate tracking-tight">{{ contacto.nombreCompleto }}</h4>
          <div class="flex items-center gap-1.5 mt-1">
            <span class="text-[10px] text-slate-400 font-medium tracking-wide">{{ contacto.campana }}</span>
            <span v-if="contacto.estadoLead === 'Prospecto'" class="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-px rounded font-black uppercase tracking-tight animate-in fade-in duration-200">
              {{ contacto.estadoLead }}
            </span>
          </div>
        </div>
        <span class="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[9px] font-black uppercase shrink-0 tracking-wider">
          {{ contacto.rol }}
        </span>
      </div>
    </div>

    <div v-if="contactosRenderizados.length === 0" class="p-8 text-center text-slate-400 text-xs font-medium">
      No se encontraron registros en esta categoría.
    </div>
  </div>
</template>