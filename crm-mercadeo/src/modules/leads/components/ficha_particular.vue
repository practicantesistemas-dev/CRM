<script setup lang="ts">
import { computed } from 'vue'

// --- INTERFACES DE MODELO ---
interface ServicioParticular { nombre: string; fecha: string; estado: 'Activo' | 'Terminado'; }
interface Beneficiario { nombreCompleto: string; tipoDocumento: string; documento: string; edad: number; genero: string; telefono?: string; parentesco: string; }
interface Contacto { idUnico: string; nombreCompleto: string; rol: 'titular' | 'beneficiario'; tipoDocumento: string; documento: string; telefono: string; whatsapp: string; email: string; ciudad: string; pais: string; canalOrigen: string; campana: string; estadoLead: string; ultimoContacto: string; proximoContacto: string; cantidadLlamadas: number; cantidadEmails: number; notes?: string; edad: number; genero: string; serviciosHistoricos: ServicioParticular[]; beneficiariosAsociados?: Beneficiario[]; bitacora?: any[]; }

// --- PROPS & EMITS ---
const props = defineProps<{
  contacto: Contacto
}>()

const emit = defineEmits<{
  (e: 'abrir-modal-beneficiario'): void
}>()

// --- FILTRO DE SERVICIOS INTERNO ---
const busquedaCriterioServicio = defineModel<string>('busquedaServicio', { default: '' })

const serviciosHistoricosFiltrados = computed(() => {
  const criterio = busquedaCriterioServicio.value.trim().toLowerCase()
  if (!criterio) return props.contacto.serviciosHistoricos || []
  return (props.contacto.serviciosHistoricos || []).filter(serv => 
    serv.nombre.toLowerCase().includes(criterio) || serv.fecha.includes(criterio)
  )
})
</script>

<template>
  <div class="flex-1 flex flex-col bg-white p-5">
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
      
      <div class="xl:col-span-2 space-y-5">
        <div class="pb-3 border-b border-slate-200">
          <span class="text-[9px] bg-pink-50 text-pink-700 border border-pink-200 font-black px-3 py-1 rounded-md uppercase tracking-widest inline-block shadow-2xs">
            {{ contacto.estadoLead }}
          </span>
          <h2 class="text-xl font-black text-slate-900 tracking-tight mt-2.5">
            {{ contacto.nombreCompleto }}
          </h2>
          <p class="text-[10px] font-mono text-slate-400 mt-1 tracking-wider uppercase font-bold">
            Código Único: {{ contacto.idUnico }}
          </p>
        </div>

        <div>
          <h3 class="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2.5 pb-1 border-b border-slate-100">
            Canales de Contactabilidad
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              <span class="text-slate-400 font-black block text-[9px] uppercase tracking-wider">Línea Móvil Directa</span>
              <strong class="text-slate-800 font-mono text-xs block mt-1 font-bold">{{ contacto.telefono }}</strong>
            </div>
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              <span class="text-slate-400 font-black block text-[9px] uppercase tracking-wider">Enlace WhatsApp corporativo</span>
              <strong class="text-slate-800 font-mono text-xs block mt-1 font-bold">{{ contacto.whatsapp }}</strong>
            </div>
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-200/60 sm:col-span-2">
              <span class="text-slate-400 font-black block text-[9px] uppercase tracking-wider">Correo Electrónico Validado</span>
              <strong class="text-slate-800 text-xs block mt-1 truncate font-bold">{{ contacto.email }}</strong>
            </div>
          </div>
        </div>

        <div>
          <div class="flex justify-between items-center mb-2.5 pb-1 border-b border-slate-100">
            <h3 class="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Perfil Demográfico & Legal
            </h3>
            <button 
              @click="emit('abrir-modal-beneficiario')" 
              class="text-[9px] bg-blue-50 text-blue-700 hover:bg-blue-100 font-black px-2 py-0.5 rounded transition-colors uppercase tracking-wider cursor-pointer"
            >
              + Vincular Beneficiario
            </button>
          </div>
          <div class="grid grid-cols-2 gap-3 text-xs font-semibold">
            <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-200/40">
              <span class="text-slate-400 block text-[9px] uppercase tracking-wider">Sexo / Género</span>
              <strong class="text-slate-800 block mt-0.5 font-bold">{{ contacto.genero }}</strong>
            </div>
            <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-200/40">
              <span class="text-slate-400 block text-[9px] uppercase tracking-wider">Edad Cronológica</span>
              <strong class="text-slate-800 block mt-0.5 font-mono font-bold">{{ contacto.edad }} años</strong>
            </div>
            <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-200/40">
              <span class="text-slate-400 block text-[9px] uppercase tracking-wider">Identificación Legal</span>
              <strong class="text-slate-800 block mt-0.5 font-mono font-bold">{{ contacto.tipoDocumento }} - {{ contacto.documento }}</strong>
            </div>
            <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-200/40">
              <span class="text-slate-400 block text-[9px] uppercase tracking-wider">Ubicación Radicada</span>
              <strong class="text-slate-800 block mt-0.5 font-bold">{{ contacto.ciudad }}, {{ contacto.pais }}</strong>
            </div>
          </div>
        </div>
        
        <div v-if="contacto.beneficiariosAsociados && contacto.beneficiariosAsociados.length > 0">
          <h3 class="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2.5 pb-1 border-b border-slate-100">
            Núcleo Familiar Registrado ({{ contacto.beneficiariosAsociados.length }})
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
            <div v-for="(b, i) in contacto.beneficiariosAsociados" :key="i" class="p-2.5 bg-slate-50/60 border border-slate-200/50 rounded-lg flex flex-col">
              <span class="text-slate-900 block font-bold truncate">{{ b.nombreCompleto }}</span>
              <span class="text-[9px] text-slate-400 block mt-0.5 font-mono">{{ b.parentesco }} — {{ b.tipoDocumento }}: {{ b.documento }} ({{ b.edad }} años)</span>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t xl:border-t-0 xl:border-l border-slate-200 pt-4 xl:pt-0 xl:pl-5 flex flex-col">
        <h3 class="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 pb-1 border-b border-slate-100">
          Portafolio de Servicios
        </h3>
        <div class="mb-3">
          <input 
            type="text" 
            v-model="busquedaCriterioServicio" 
            placeholder="Filtrar por servicio o fecha..." 
            class="w-full bg-slate-50 text-slate-800 placeholder-slate-400 rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all shadow-inner" 
          />
        </div>
        <div class="space-y-2 pr-1 font-semibold overflow-y-auto max-h-[340px]">
          <div 
            v-for="(serv, idx) in serviciosHistoricosFiltrados" 
            :key="idx" 
            class="p-3 bg-white border border-slate-200/80 rounded-xl flex justify-between items-center text-xs shadow-2xs"
          >
            <div class="min-w-0">
              <strong class="text-slate-900 block font-bold truncate tracking-tight">{{ serv.nombre }}</strong>
              <span class="text-[9px] text-slate-400 font-mono block mt-0.5">Fecha: {{ serv.fecha }}</span>
            </div>
            <span :class="['text-[8px] px-2 py-0.5 rounded-md font-black uppercase border shrink-0 tracking-wider', serv.estado === 'Activo' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200']">
              {{ serv.estado }}
            </span>
          </div>
          <div v-if="serviciosHistoricosFiltrados.length === 0" class="text-center p-4 text-[10px] text-slate-400 font-medium">
            No se encontraron servicios históricos vinculados.
          </div>
        </div>
      </div>

    </div>
  </div>
</template>