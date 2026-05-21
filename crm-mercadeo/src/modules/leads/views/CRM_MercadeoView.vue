<script setup lang="ts">
import { ref, shallowRef, watch } from 'vue'

// --- COMPONENTES MODULARES ---
import BandejaInteligencia from '../components/bandeja_inteligencia.vue'
import ModuloGeneral from '../components/modulo_general.vue'
import FichaParticular from '../components/ficha_particular.vue'
import Bitacora from '../components/bitacora.vue'
import GestionMasiva from '../components/gestion_masiva.vue' 
import VincularBeneficiario from '../components/vincular_beneficiario.vue'

// Control de sub-pestañas internas del panel derecho
const subTabDerechoActivo = ref<'bitacora' | 'gestion'>('bitacora')

// Función para manejar la subida del Excel devuelta por el componente hijo
const procesarArchivoExcelCargado = (payload: { seccion: string, archivo: File }) => {
  alert(`Archivo de tipo [${payload.seccion}] recibido con éxito: ${payload.archivo.name}. Listo para procesamiento masivo.`);
}

// --- ESTADOS DE CONTROL ---
const panelIzquierdoVisible = ref<boolean>(true)
const panelDerechoVisible = ref<boolean>(true)
const modoVista = ref<'general' | 'particular'>('general')
const isModalBeneficiarioOpen = ref<boolean>(false)

// --- INTERFACES DE MODELO ---
interface ServicioParticular { nombre: string; fecha: string; estado: 'Activo' | 'Terminado'; }
interface Beneficiario { nombreCompleto: string; tipoDocumento: string; documento: string; edad: number; genero: string; telefono?: string; parentesco: string; }
interface Contacto { idUnico: string; nombreCompleto: string; rol: 'titular' | 'beneficiario'; tipoDocumento: string; documento: string; telefono: string; whatsapp: string; email: string; ciudad: string; pais: string; canalOrigen: string; campana: string; estadoLead: string; ultimoContacto: string; proximoContacto: string; cantidadLlamadas: number; cantidadEmails: number; notes?: string; edad: number; genero: string; serviciosHistoricos: ServicioParticular[]; beneficiariosAsociados?: Beneficiario[]; bitacora?: any[]; }

// --- FILTROS DE BÚSQUEDA ---
const busqueda = ref<string>('')
const filtroRol = ref<string>('todos')
const filtroEstado = ref<string>('todos')
const filtroOrigen = ref<string>('todos')
const filtroCampana = ref<string>('todos')
const filtroEdad = ref<string>('todos')
const busquedaCriterioServicio = ref<string>('')

const contactosFiltrados = shallowRef<Contacto[]>([])
const contactoSeleccionado = ref<Contacto | null>(null)

const calcularTotalMiembros = (c: Contacto): number => {
  return 1 + (c.beneficiariosAsociados?.length || 0);
}

const capturarYVincularBeneficiario = (nuevoBeneficiario: Beneficiario) => {
  if (!contactoSeleccionado.value) return;
  if (!contactoSeleccionado.value.beneficiariosAsociados) {
    contactoSeleccionado.value.beneficiariosAsociados = [];
  }
  if (calcularTotalMiembros(contactoSeleccionado.value) < 5) {
    contactoSeleccionado.value.beneficiariosAsociados.push(nuevoBeneficiario);
  }
}

const guardarNotaGestion = () => {
  if (contactoSeleccionado.value) {
    alert(`Gestión guardada exitosamente en el Plan Liga para ${contactoSeleccionado.value.nombreCompleto}`);
  }
}

const cargarData = () => {
  const mock: Contacto[] = [
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
      ]
    }
  ]

  contactosFiltrados.value = mock.filter(c => {
    const coincideBusqueda = c.nombreCompleto.toLowerCase().includes(busqueda.value.toLowerCase()) || c.documento.includes(busqueda.value);
    const coincideRol = filtroRol.value === 'todos' || c.rol === filtroRol.value;
    const coincideEstado = filtroEstado.value === 'todos' || c.estadoLead === filtroEstado.value;
    return coincideBusqueda && coincideRol && coincideEstado;
  });
}

const seleccionarContacto = (contacto: Contacto) => {
  contactoSeleccionado.value = contacto;
  modoVista.value = 'particular'; 
}

const activarModoParticular = () => {
  if (contactoSeleccionado.value) modoVista.value = 'particular';
}

watch([busqueda, filtroRol, filtroEstado], () => { cargarData() })
cargarData()
</script>

<template>
  <div class="h-screen max-h-screen bg-slate-50 font-sans flex flex-col text-slate-800 antialiased w-full overflow-hidden select-none">
    
    <header class="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-950 text-white h-14 px-5 flex justify-between items-center shadow-md shrink-0 z-30 border-b border-blue-900/40">
      <div class="flex items-center gap-4">
        <div class="flex items-center h-9">
          <img src="/logo-liga-50.png" alt="Fundación La Liga" class="h-full w-auto object-contain brightness-0 invert select-none pointer-events-none" />
        </div>
        <div class="h-6 w-px bg-blue-600/60"></div>
        <div>
          <span class="text-[9px] text-blue-200 block font-bold uppercase tracking-widest leading-none">Plataforma Institucional</span>
          <h1 class="text-xs font-black tracking-wider text-white uppercase mt-0.5">CRM Mercadeo</h1>
        </div>
      </div>
      
      <div class="flex items-center gap-4 text-xs font-semibold">
        <div class="h-8 w-px bg-blue-600/60"></div>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-black text-white text-xs shadow-inner">
            PL
          </div>
          <button @click="$emit('logout')" class="text-[10px] uppercase font-black tracking-wider text-blue-200 hover:text-pink-300 transition-colors cursor-pointer px-2 py-1 rounded hover:bg-white/5">
            Salir
          </button>
        </div>
      </div>
    </header>

    <div class="flex-1 flex p-3 gap-3 w-full relative overflow-hidden h-[calc(100vh-3.5rem)]">
   
      <section 
        :class="[
          'bg-white rounded-xl border border-slate-200/80 flex flex-col shadow-xs transition-all duration-300 relative shrink-0 overflow-hidden min-h-0',
          panelIzquierdoVisible ? 'w-80 opacity-100' : 'w-0 opacity-0 pointer-events-none border-none'
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

      <button @click="panelIzquierdoVisible = !panelIzquierdoVisible" class="bg-slate-200 text-slate-600 hover:bg-blue-700 hover:text-white w-4 h-12 self-center flex items-center justify-center rounded-r-md shadow-xs cursor-pointer z-40 shrink-0 transition-all border border-l-0 border-slate-300 -ml-3">
        <span class="text-[8px] font-black font-mono">{{ panelIzquierdoVisible ? '◀' : '▶' }}</span>
      </button>

      <section class="flex-1 flex flex-col bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden min-h-0">
        <div class="flex border-b border-slate-200 bg-slate-50 px-4 pt-2.5 shrink-0 gap-1.5">
          <button @click="modoVista = 'general'" :class="['px-4 py-2 text-[11px] font-black uppercase tracking-wider transition-all border-t border-x rounded-t-lg cursor-pointer', modoVista === 'general' ? 'border-slate-200 border-b-white bg-white text-blue-900' : 'border-transparent text-slate-400 hover:text-slate-600']">
            Módulo General (Global)
          </button>
          <button @click="activarModoParticular" :disabled="!contactoSeleccionado" :class="['px-4 py-2 text-[11px] font-black uppercase tracking-wider transition-all border-t border-x rounded-t-lg flex items-center gap-1.5', !contactoSeleccionado ? 'opacity-30 cursor-not-allowed text-slate-300' : 'cursor-pointer', modoVista === 'particular' ? 'border-slate-200 border-b-white bg-white text-pink-600' : 'border-transparent text-slate-400 hover:text-pink-500']">
            Ficha Particular: {{ contactoSeleccionado ? contactoSeleccionado.nombreCompleto : 'Ninguno Seleccionado' }}
          </button>
        </div>

        <div class="flex-1 min-h-0 overflow-y-auto">
          <ModuloGeneral v-if="modoVista === 'general'" />
          <FichaParticular 
            v-else-if="modoVista === 'particular' && contactoSeleccionado"
            :contacto="contactoSeleccionado"
            v-model:busquedaService="busquedaCriterioServicio"
            @abrir-modal-beneficiario="isModalBeneficiarioOpen = true"
          />
        </div>
      </section>

      <button @click="panelDerechoVisible = !panelDerechoVisible" class="bg-slate-200 text-slate-600 hover:bg-blue-700 hover:text-white w-4 h-12 self-center flex items-center justify-center rounded-l-md shadow-xs cursor-pointer z-40 shrink-0 transition-all border border-r-0 border-slate-300 -ml-3">
        <span class="text-[8px] font-black font-mono">{{ panelDerechoVisible ? '▶' : '◀' }}</span>
      </button>

      <section 
        :class="[
          'bg-white rounded-xl border border-slate-200/80 flex flex-col shadow-xs transition-all duration-300 relative shrink-0 overflow-hidden min-h-0',
          panelDerechoVisible ? 'w-80 opacity-100' : 'w-0 opacity-0 pointer-events-none border-none'
        ]"
      >
        <div class="flex border-b border-slate-200 bg-slate-50 rounded-t-xl overflow-hidden shrink-0 p-1 gap-1">
          <button @click="subTabDerechoActivo = 'bitacora'" :class="['flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all text-center rounded-lg cursor-pointer', subTabDerechoActivo === 'bitacora' ? 'bg-white text-pink-600 shadow-2xs border border-slate-200/40' : 'text-slate-400 hover:text-slate-600']">Bitácora</button>
          <button @click="subTabDerechoActivo = 'gestion'" :class="['flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all text-center rounded-lg cursor-pointer', subTabDerechoActivo === 'gestion' ? 'bg-white text-blue-800 shadow-2xs border border-slate-200/40' : 'text-slate-400 hover:text-slate-600']">Gestión Masiva</button>
        </div>
        
        <div 
          v-if="contactoSeleccionado"
          class="flex-1 min-h-0 overflow-y-auto p-3 space-y-4 text-xs font-semibold flex flex-col"
        >
          <Bitacora v-if="subTabDerechoActivo === 'bitacora'" :contacto="contactoSeleccionado" @guardar="guardarNotaGestion" />
          <div v-else-if="subTabDerechoActivo === 'gestion'">
            <GestionMasiva v-model:contacto="contactoSeleccionado" @carga-excel="procesarArchivoExcelCargado" />
          </div>
        </div>
        
        <div v-else class="flex-1 flex items-center justify-center p-5 text-center text-slate-300 text-[10px] font-black uppercase tracking-widest leading-loose">
          Seleccione un registro<br>para agendar gestión.
        </div>
      </section>

    </div>

    <VincularBeneficiario :is-open="isModalBeneficiarioOpen" :titular-nombre="contactoSeleccionado?.nombreCompleto || ''" :miembros-actuales="contactoSeleccionado ? calcularTotalMiembros(contactoSeleccionado) : 0" @close="isModalBeneficiarioOpen = false" @save="capturarYVincularBeneficiario" />
  </div>
</template>