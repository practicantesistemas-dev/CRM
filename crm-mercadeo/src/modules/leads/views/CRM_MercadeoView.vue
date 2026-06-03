<script setup lang="ts">
import { ref, shallowRef, watch } from 'vue'

// --- COMPONENTES MODULARES ---
import BandejaInteligencia from '../components/bandeja_inteligencia.vue'
import ModuloGeneral from '../components/modulo_general.vue'
import FichaParticular from '../components/ficha_particular.vue'
import Bitacora from '../components/bitacora.vue'
import GestionMasiva from '../components/gestion_masiva.vue' 

// --- INTERFACES DE MODELO ESTRICTAS ---
export type RolContacto = 'titular' | 'beneficiario'
export type EstadoServicio = 'Activo' | 'Terminado'

export interface ServicioParticular { 
  nombre: string
  fecha: string
  estado: EstadoServicio 
}

export interface Beneficiario { 
  nombreCompleto: string
  tipoDocumento: string
  documento: string
  edad: number
  genero: string
  telefono?: string
  parentesco: string 
}

export interface Seguimiento {
  fecha: string
  hora: string
  tipo: 'llamada' | 'correo' | 'whatsapp' | 'visita' | 'nota'
  descripcion: string
}

export interface Contacto { 
  idUnico: string
  nombreCompleto: string
  rol: RolContacto
  tipoDocumento: string
  documento: string
  telefono: string
  whatsapp: string
  email: string
  ciudad: string
  pais: string
  canalOrigen: string
  campana: string
  estadoLead: string
  ultimoContacto: string
  proximoContacto: string
  cantidadLlamadas: number
  cantidadEmails: number
  notes?: string
  edad: number
  genero: string
  serviciosHistoricos: ServicioParticular[]
  beneficiariosAsociados?: Beneficiario[]
  seguimientos?: Seguimiento[]
}

// --- DEFINE EMITS ---
defineEmits<{
  (e: 'logout'): void
}>()

// --- ESTADOS DE CONTROL DE VISTA Y DIAL ---
const subTabDerechoActivo = ref<'bitacora' | 'gestion'>('bitacora')
const panelIzquierdoVisible = ref<boolean>(true)
const panelDerechoVisible = ref<boolean>(true)
const modoVista = ref<'general' | 'particular'>('general')
const isModalBeneficiarioOpen = ref<boolean>(false)

// --- FILTROS DE BÚSQUEDA ---
const busqueda = ref<string>('')
const filtroRol = ref<string>('todos')
const filtroEstado = ref<string>('todos')
const filtroOrigen = ref<string>('todos')
const filtroCampana = ref<string>('todos')
const filtroEdad = ref<string>('todos')
const busquedaCriterioServicio = ref<string>('')

// --- BASE DE DATOS Y REACTIVIDAD ---
const contactosRaw = ref<Contacto[]>([])
const contactosFiltrados = shallowRef<Contacto[]>([])
const contactoSeleccionado = ref<Contacto | null>(null)

// --- LÓGICA DE NEGOCIO ---
const calcularTotalMiembros = (c: Contacto): number => {
  return 1 + (c.beneficiariosAsociados?.length || 0)
}

const capturarYVincularBeneficiario = (nuevoBeneficiario: Beneficiario) => {
  if (!contactoSeleccionado.value) return
  
  if (!contactoSeleccionado.value.beneficiariosAsociados) {
    contactoSeleccionado.value.beneficiariosAsociados = []
  }
  
  if (calcularTotalMiembros(contactoSeleccionado.value) < 5) {
    contactoSeleccionado.value.beneficiariosAsociados.push(nuevoBeneficiario)
    sincronizarCambioEnLista(contactoSeleccionado.value)
  } else {
    alert('El núcleo familiar no puede exceder el límite de 5 miembros en el Plan Liga.')
  }
}

// Intercepta el evento emitido por el componente Bitacora sin mutación directa prohibida
const manejarNuevoSeguimiento = (nuevoSeguimiento: Seguimiento) => {
  if (!contactoSeleccionado.value) return

  if (!contactoSeleccionado.value.seguimientos) {
    contactoSeleccionado.value.seguimientos = []
  }

  // Insertar al inicio del historial (Orden cronológico inverso)
  contactoSeleccionado.value.seguimientos.unshift(nuevoSeguimiento)

  // Incrementar contadores dinámicamente según el canal
  if (nuevoSeguimiento.tipo === 'llamada') {
    contactoSeleccionado.value.cantidadLlamadas++
  } else if (nuevoSeguimiento.tipo === 'correo') {
    contactoSeleccionado.value.cantidadEmails++
  }

  sincronizarCambioEnLista(contactoSeleccionado.value)
  alert(`Seguimiento registrado con éxito para ${contactoSeleccionado.value.nombreCompleto}`)
}

const manejarCambioProximoContacto = (nuevaFecha: string) => {
  if (!contactoSeleccionado.value) return
  contactoSeleccionado.value.proximoContacto = nuevaFecha
  sincronizarCambioEnLista(contactoSeleccionado.value)
}

// Mantiene la lista general actualizada si el objeto seleccionado sufre mutaciones internas controladas
const sincronizarCambioEnLista = (contactoActualizado: Contacto) => {
  const index = contactosRaw.value.findIndex(c => c.idUnico === contactoActualizado.idUnico)
  if (index !== -1) {
    contactosRaw.value[index] = { ...contactoActualizado }
    ejecutarFiltrado()
  }
}

const procesarArchivoExcelCargado = (payload: { seccion: string; archivo: File }) => {
  alert(`Archivo de tipo [${payload.seccion}] recibido con éxito: ${payload.archivo.name}. Listo para procesamiento masivo.`);
}

// --- PIPELINE DE FILTRADO ---
const ejecutarFiltrado = () => {
  const query = busqueda.value.trim().toLowerCase()
  const rol = filtroRol.value
  const estado = filtroEstado.value

  contactosFiltrados.value = contactosRaw.value.filter(c => {
    const coincideBusqueda = !query || 
      c.nombreCompleto.toLowerCase().includes(query) || 
      c.documento.includes(query) || 
      c.idUnico.toLowerCase().includes(query)
      
    const coincideRol = rol === 'todos' || c.rol === rol
    const coincideEstado = estado === 'todos' || c.estadoLead === estado
    
    return coincideBusqueda && coincideRol && coincideEstado
  })
}

// --- SEED DE MOCK DATA ---
const inicializarBaseDatos = () => {
  contactosRaw.value = [
    {
      idUnico: "PL-2410",
      nombreCompleto: "Carlos Mendoza",
      rol: "titular",
      tipoDocumento: "CC",
      documento: "10293844",
      telefono: "300-555-0192",
      whatsapp: "+57 300 5550192",
      email: "carlos.mendoza@constructora.com",
      ciudad: "Pereira",
      pais: "Colombia",
      canalOrigen: "Facebook Ads",
      campana: "Estética Mayo",
      estadoLead: "Interesado",
      ultimoContacto: "2026-05-19",
      proximoContacto: "2026-05-24",
      cantidadLlamadas: 4,
      cantidadEmails: 12,
      notes: "Interesado en revisión corporativa para el núcleo familiar.",
      edad: 35,
      genero: "Masculino",
      serviciosHistoricos: [
        { nombre: "Profilaxis de Entrada", fecha: "2026-03-15", estado: "Terminado" },
        { nombre: "Ortodoncia de Avanzada", fecha: "2026-05-10", estado: "Activo" }
      ],
      beneficiariosAsociados: [
        { nombreCompleto: "Laura Mendoza", tipoDocumento: "TI", documento: "110293", edad: 12, genero: "Femenino", parentesco: "Hijo(a)" }
      ],
      seguimientos: [
        { fecha: "2026-05-19", hora: "14:30", tipo: "llamada", descripcion: "Llamada de seguimiento, solicita cotización detallada por correo." }
      ]
    }
  ]
  ejecutarFiltrado()
}

const seleccionarContacto = (contacto: Contacto) => {
  contactoSeleccionado.value = contacto
  modoVista.value = 'particular' 
}

const activarModoParticular = () => {
  if (contactoSeleccionado.value) modoVista.value = 'particular'
}

// Escuchador de filtros unificado para evitar cargas infinitas de arrays
watch([busqueda, filtroRol, filtroEstado], () => { ejecutarFiltrado() })

// Carga inicial limpia
inicializarBaseDatos()
</script>

<template>
  <div class="h-screen max-h-screen bg-slate-50 font-sans flex flex-col text-slate-800 antialiased w-full overflow-hidden select-none">
    
    <header class="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-950 text-white h-16 px-5 flex justify-between items-center shadow-md shrink-0 z-30 border-b border-blue-900/40">
      <div class="flex items-center gap-4">
        <div class="flex items-center h-12">
          <img 
            src="/logo-liga-50.png" 
            alt="Fundación La Liga" 
            class="h-8 w-auto object-contain brightness-0 invert select-none pointer-events-none"
          />
        </div>
        <div class="h-6 w-px bg-blue-600/60"></div>
        <div>
          <span class="text-[8px] text-blue-200 block font-black uppercase tracking-widest leading-none">
            Plataforma Institucional
          </span>
          <h1 class="text-sm font-black tracking-wider text-white uppercase mt-0.5">
            CRM Mercadeo
          </h1>
        </div>
      </div>
      
      <div class="flex items-center gap-3 text-xs font-semibold">
        <div class="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-black text-white text-[11px] shadow-inner">
          PL
        </div>
        <button 
          @click="$emit('logout')" 
          class="text-[9px] uppercase font-black tracking-widest text-blue-200 hover:text-pink-300 transition-colors cursor-pointer px-2 py-1 rounded hover:bg-white/5"
        >
          Salir
        </button>
      </div>
    </header>

    <div class="flex-1 flex flex-col lg:flex-row p-3 gap-3 w-full relative overflow-hidden h-[calc(100vh-4rem)]">
  
      <section 
        :class="[
          'bg-white rounded-xl border border-slate-200/80 flex flex-col shadow-xs transition-all duration-300 relative shrink-0 overflow-hidden min-h-0',
          panelIzquierdoVisible ? 'w-full lg:w-72 xl:w-80 opacity-100' : 'w-0 h-0 lg:h-auto opacity-0 pointer-events-none border-none'
        ]"
      >
        <div class="flex-1 min-h-0 overflow-y-auto">
          <BandejaInteligencia 
            :contactos-filtrados="contactosFiltrados"
            :contacto-seleccionado="contactoSeleccionado"
            :modo-vista="modoVista"
            v-model:busqueda="busqueda"
            v-model:filtroRol="filtroRol"
            v-model:filtroEstado="filtroEstado"
            v-model:filtroOrigen="filtroOrigen"
            v-model:filtroCampana="filtroCampana"
            v-model:filtroEdad="filtroEdad"
            @seleccionar="seleccionarContacto"
          />
        </div>
      </section>

      <button 
        @click="panelIzquierdoVisible = !panelIzquierdoVisible" 
        class="hidden lg:flex bg-slate-200 text-slate-600 hover:bg-blue-700 hover:text-white w-4 h-12 self-center items-center justify-center rounded-r-md shadow-xs cursor-pointer z-40 shrink-0 transition-all border border-l-0 border-slate-300 -ml-3"
      >
        <span class="text-[8px] font-black font-mono">{{ panelIzquierdoVisible ? '◀' : '▶' }}</span>
      </button>

      <section class="flex-1 lg:flex-[2.5] xl:flex-[3] flex flex-col bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden min-h-0">
        <div class="flex border-b border-slate-200 bg-slate-50 px-4 pt-2.5 shrink-0 gap-1.5 overflow-x-auto scrollbar-none">
          <button 
            @click="modoVista = 'general'" 
            :class="['px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all border-t border-x rounded-t-lg shrink-0 cursor-pointer', modoVista === 'general' ? 'border-slate-200 border-b-white bg-white text-blue-900' : 'border-transparent text-slate-400 hover:text-slate-600']"
          >
            Módulo General (Global)
          </button>
          <button 
            @click="activarModoParticular" 
            :disabled="!contactoSeleccionado" 
            :class="['px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all border-t border-x rounded-t-lg flex items-center gap-1.5 shrink-0', !contactoSeleccionado ? 'opacity-30 cursor-not-allowed text-slate-300' : 'cursor-pointer', modoVista === 'particular' ? 'border-slate-200 border-b-white bg-white text-pink-600' : 'border-transparent text-slate-400 hover:text-pink-500']"
          >
            Ficha Particular: {{ contactoSeleccionado ? contactoSeleccionado.nombreCompleto : 'Ninguno Seleccionado' }}
          </button>
        </div>

        <div class="flex-1 min-h-0 overflow-y-auto">
          <ModuloGeneral v-if="modoVista === 'general'" />
          <FichaParticular 
            v-else-if="modoVista === 'particular' && contactoSeleccionado"
            :contacto="contactoSeleccionado"
            @abrir-modal-beneficiario="isModalBeneficiarioOpen = true"
          />
        </div>
      </section>

      <button 
        @click="panelDerechoVisible = !panelDerechoVisible" 
        class="hidden lg:flex bg-slate-200 text-slate-600 hover:bg-blue-700 hover:text-white w-4 h-12 self-center items-center justify-center rounded-l-md shadow-xs cursor-pointer z-40 shrink-0 transition-all border border-r-0 border-slate-300 -ml-3"
      >
        <span class="text-[8px] font-black font-mono">{{ panelDerechoVisible ? '▶' : '◀' }}</span>
      </button>

      <section 
        :class="[
          'bg-white rounded-xl border border-slate-200/80 flex flex-col shadow-xs transition-all duration-300 relative shrink-0 overflow-hidden min-h-0',
          panelDerechoVisible ? 'w-full lg:w-72 xl:w-80 opacity-100' : 'w-0 h-0 lg:h-auto opacity-0 pointer-events-none border-none'
        ]"
      >
        <div class="flex border-b border-slate-200 bg-slate-50 rounded-t-xl overflow-hidden shrink-0 p-1 gap-1">
          <button @click="subTabDerechoActivo = 'bitacora'" :class="['flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all text-center rounded-lg cursor-pointer', subTabDerechoActivo === 'bitacora' ? 'bg-white text-pink-600 shadow-3xs border border-slate-200/40' : 'text-slate-400 hover:text-slate-600']">Bitácora</button>
          <button @click="subTabDerechoActivo = 'gestion'" :class="['flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all text-center rounded-lg cursor-pointer', subTabDerechoActivo === 'gestion' ? 'bg-white text-blue-800 shadow-3xs border border-slate-200/40' : 'text-slate-400 hover:text-slate-600']">Gestión</button>
        </div>
        
        <div 
          v-if="contactoSeleccionado"
          class="flex-1 min-h-0 overflow-y-auto p-3 flex flex-col"
        >
          <Bitacora 
            v-if="subTabDerechoActivo === 'bitacora'" 
            :contacto="contactoSeleccionado" 
            @agregar-seguimiento="manejarNuevoSeguimiento"
            @update:proximo-contacto="manejarCambioProximoContacto"
          />
          <div v-else-if="subTabDerechoActivo === 'gestion'" class="text-xs font-semibold">
            <GestionMasiva v-model:contacto="contactoSeleccionado" @carga-excel="procesarArchivoExcelCargado" />
          </div>
        </div>
        
        <div v-else class="flex-1 flex items-center justify-center p-5 text-center text-slate-300 text-[9px] font-black uppercase tracking-widest leading-loose">
          Seleccione un registro<br>para agendar gestión.
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
/* Elimina barras de scroll feas en Chrome/Safari */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>