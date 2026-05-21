<script setup lang="ts">
import { ref, watch } from 'vue'

// --- INTERFACES (Exactamente las tuyas) ---
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
  (e: 'update:busqueda', val: string): void
  (e: 'update:filtroRol', val: string): void
  (e: 'update:filtroEstado', val: string): void
  (e: 'update:filtroOrigen', val: string): void
  (e: 'update:filtroCampana', val: string): void
  (e: 'update:filtroEdad', val: string): void
}>()

// --- WATCHERS PARA SINCRONIZACIÓN EMIT/PROP ---
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
</script>

<template>
  <div class="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center shrink-0 rounded-t-xl">
    <span class="text-[10px] font-black uppercase text-slate-500 tracking-widest">Bandeja de Inteligencia</span>
    <span class="text-[10px] bg-blue-700 text-white font-mono px-2 py-0.5 rounded-md font-black shadow-xs">
      {{ contactosFiltrados.length }}
    </span>
  </div>

  <div class="p-3 bg-white border-b border-slate-100 space-y-3 shrink-0 shadow-2xs">
    <div class="relative">
      <input 
        v-model="busquedaLocal" 
        type="text" 
        placeholder="Buscar Cédula, Nombre o Teléfono..." 
        class="w-full bg-slate-50 text-slate-900 placeholder-slate-400 rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all shadow-inner" 
      />
    </div>

    <div>
      <label class="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Tipo de Contacto</label>
      <div class="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold text-center">
        <button type="button" @click="filtroRolLocal = 'todos'" :class="['py-1 rounded-md cursor-pointer transition-all', filtroRolLocal === 'todos' ? 'bg-white text-blue-800 shadow-xs font-black' : 'text-slate-400 hover:text-slate-600']">Todos</button>
        <button type="button" @click="filtroRolLocal = 'titular'" :class="['py-1 rounded-md cursor-pointer transition-all', filtroRolLocal === 'titular' ? 'bg-white text-blue-800 shadow-xs font-black' : 'text-slate-400 hover:text-slate-600']">Titulares</button>
        <button type="button" @click="filtroRolLocal = 'beneficiario'" :class="['py-1 rounded-md cursor-pointer transition-all', filtroRolLocal === 'beneficiario' ? 'bg-white text-blue-800 shadow-xs font-black' : 'text-slate-400 hover:text-slate-600']">Benefic.</button>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2 text-xs pt-1">
      <div class="space-y-0.5">
        <label class="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Estado Comercial</label>
        <select v-model="filtroEstadoLocal" class="w-full bg-slate-50 border border-slate-200 rounded-md p-1.5 font-semibold text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all">
          <option value="todos">Todos</option>
          <option value="Prospecto">Prospecto</option>
          <option value="Interesado">Interesado</option>
          <option value="Cita Agendada">Cita Agendada</option>
          <option value="Cliente Cerrado">Cliente Cerrado</option>
        </select>
      </div>
      <div class="space-y-0.5">
        <label class="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Canal Origen</label>
        <select v-model="filtroOrigenLocal" class="w-full bg-slate-50 border border-slate-200 rounded-md p-1.5 font-semibold text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all">
          <option value="todos">Todos</option>
          <option value="Facebook Ads">Facebook Ads</option>
          <option value="Google Ads">Google Ads</option>
          <option value="WhatsApp Directo">WhatsApp Directo</option>
        </select>
      </div>
      <div class="space-y-0.5">
        <label class="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Campaña Activa</label>
        <select v-model="filtroCampanaLocal" class="w-full bg-slate-50 border border-slate-200 rounded-md p-1.5 font-semibold text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all">
          <option value="todos">Todas</option>
          <option value="Estética Mayo">Estética Mayo</option>
          <option value="Ortodoncia">Ortodoncia</option>
        </select>
      </div>
      <div class="space-y-0.5">
        <label class="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Segmento Edad</label>
        <select v-model="filtroEdadLocal" class="w-full bg-slate-50 border border-slate-200 rounded-md p-1.5 font-semibold text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all">
          <option value="todos">Cualquiera</option>
          <option value="joven">Jóvenes (&lt; 25)</option>
          <option value="adulto">Adultos (25-50)</option>
        </select>
      </div>
    </div>
  </div>

  <div class="flex-1 divide-y divide-slate-100 overflow-y-auto">
    <div 
      v-for="contacto in contactosFiltrados" 
      :key="contacto.idUnico" 
      @click="emit('seleccionar', contacto)"
      :class="['p-3.5 cursor-pointer transition-all border-l-4 relative', (modoVista === 'particular' && contactoSeleccionado?.idUnico === contacto.idUnico) ? 'bg-blue-50/50 border-pink-500' : 'border-transparent hover:bg-slate-50/80']"
    >
      <div class="flex justify-between items-start gap-2">
        <div class="min-w-0">
          <h4 class="font-black text-xs text-slate-900 truncate tracking-tight">{{ contacto.nombreCompleto }}</h4>
          <p class="text-[10px] text-slate-400 mt-1 font-medium tracking-wide">{{ contacto.campana }}</p>
        </div>
        <span class="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[9px] font-black uppercase shrink-0 tracking-wider">
          {{ contacto.rol }}
        </span>
      </div>
    </div>
  </div>
</template>