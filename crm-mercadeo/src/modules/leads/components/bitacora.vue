<template>
  <div v-if="contacto" class="space-y-4 animate-fade-in select-none">

    <div class="grid grid-cols-2 gap-2 text-center">
      <div class="bg-slate-50 border border-slate-200 p-2.5 rounded-xl shadow-xs">
        <span class="font-black text-base font-mono block text-slate-800">
          {{ contacto.cantidadLlamadas }}
        </span>
        <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest block mt-0.5">
          Llamadas
        </span>
      </div>

      <div class="bg-slate-50 border border-slate-200 p-2.5 rounded-xl shadow-xs">
        <span class="font-black text-base font-mono block text-slate-800">
          {{ contacto.cantidadEmails }}
        </span>
        <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest block mt-0.5">
          Emails
        </span>
      </div>
    </div>

    <div class="space-y-1">
      <label class="text-[9px] font-black uppercase text-slate-500 tracking-wider">
        Próximo seguimiento
      </label>
      <input
        type="date"
        :value="contacto.proximoContacto"
        @input="actualizarProximoContacto(($event.target as HTMLInputElement).value)"
        class="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
      />
    </div>

    <form @submit.prevent="manejarEnvio" class="border-t border-slate-100 pt-3 space-y-2.5">
      <label class="text-[9px] font-black uppercase text-slate-500 tracking-wider block">
        Agregar seguimiento
      </label>

      <div class="grid grid-cols-1 gap-2">
        <select
          v-model="nuevoSeguimiento.tipo"
          class="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-blue-600 cursor-pointer"
        >
          <option value="llamada">📞 Llamada</option>
          <option value="correo">📧 Correo</option>
          <option value="whatsapp">💬 WhatsApp</option>
          <option value="visita">🤝 Visita</option>
          <option value="nota">📝 Nota</option>
        </select>

        <div class="grid grid-cols-2 gap-2">
          <input
            type="date"
            v-model="nuevoSeguimiento.fecha"
            required
            class="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-medium text-slate-700 outline-none focus:border-blue-600"
          />

          <input
            type="time"
            v-model="nuevoSeguimiento.hora"
            required
            class="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-medium text-slate-700 outline-none focus:border-blue-600"
          />
        </div>
      </div>

      <textarea
        v-model="nuevoSeguimiento.descripcion"
        rows="3"
        placeholder="Escribe los detalles del seguimiento aquí..."
        required
        class="w-full bg-white border border-slate-200 p-2.5 rounded-lg text-xs font-medium text-slate-700 outline-none focus:border-blue-600 placeholder:text-slate-400 resize-none"
      />

      <button
        type="submit"
        class="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 text-[10px] font-black uppercase tracking-wider rounded-lg shadow-xs transition-colors cursor-pointer"
      >
        + Agregar Nuevo Registro
      </button>
    </form>

    <div v-if="contacto.seguimientos && contacto.seguimientos.length > 0" class="space-y-2 border-t border-slate-100 pt-3">
      <label class="text-[9px] font-black uppercase text-slate-500 tracking-wider block">
        Historial de Bitácora
      </label>

      <div class="space-y-2 max-h-[250px] overflow-y-auto pr-1">
        <div
          v-for="(s, i) in contacto.seguimientos"
          :key="i"
          class="p-2.5 bg-slate-50/60 border border-slate-200/60 rounded-lg text-xs hover:bg-slate-50 transition-colors"
        >
          <div class="flex justify-between items-center text-[9px] text-slate-400 font-medium">
            <span class="font-mono">
              {{ s.fecha }} • {{ s.hora }}
            </span>
            <span 
              class="px-1.5 py-0.5 rounded-md font-black uppercase text-[8px] tracking-wide"
              :class="obtenerBadgeEstilo(s.tipo)"
            >
              {{ s.tipo }}
            </span>
          </div>

          <div class="mt-1 text-slate-700 font-medium leading-relaxed break-words">
            {{ s.descripcion }}
          </div>
        </div>
      </div>
    </div>

  </div>

  <div v-else class="text-slate-400 text-xs font-bold text-center py-8 border border-dashed border-slate-200 rounded-xl bg-slate-50/30">
    Selecciona un contacto para visualizar su bitácora de seguimiento
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// --- INTERFACES ---
export type TipoSeguimiento = 'llamada' | 'correo' | 'whatsapp' | 'visita' | 'nota'

export interface Seguimiento {
  fecha: string
  hora: string
  tipo: TipoSeguimiento
  descripcion: string
}

export interface Contacto {
  cantidadLlamadas: number
  cantidadEmails: number
  proximoContacto: string
  seguimientos?: Seguimiento[]
}

// --- PROPS Y EMITS ---
const props = defineProps<{
  contacto: Contacto | null
}>()

const emit = defineEmits<{
  (e: 'update:proximoContacto', nuevaFecha: string): void
  (e: 'agregarSeguimiento', nuevoSeguimiento: Seguimiento): void
}>()

// --- FACTORY FUNCTION PARA NUEVOS ESTADOS ---
const inicializarFormulario = (): Seguimiento => {
  const hoy = new Date()
  const fechaString = hoy.toISOString().split('T')[0]
  const horaString = hoy.toTimeString().split(' ')[0].slice(0, 5)

  return {
    fecha: fechaString,
    hora: horaString,
    tipo: 'llamada',
    descripcion: ''
  }
}

// --- ESTADO REACTIVO LOCAL (FORMULARIO) ---
const nuevoSeguimiento = ref<Seguimiento>(inicializarFormulario())

// --- MÉTODOS / MANEJADORES ---
const manejarEnvio = () => {
  if (!props.contacto) return

  // Validar campos requeridos antes de emitir
  if (!nuevoSeguimiento.value.descripcion.trim()) return

  // Emitimos una copia limpia del objeto hacia el componente padre
  emit('agregarSeguimiento', { ...nuevoSeguimiento.value })

  // Reseteamos el estado del formulario local de forma segura
  nuevoSeguimiento.value = inicializarFormulario()
}

const actualizarProximoContacto = (fecha: string) => {
  emit('update:proximoContacto', fecha)
}

// --- MAPEO DE ESTILOS VISUALES ---
const obtenerBadgeEstilo = (tipo: TipoSeguimiento): string => {
  const estilos: Record<TipoSeguimiento, string> = {
    llamada: 'bg-blue-50 text-blue-600 border border-blue-100',
    correo: 'bg-purple-50 text-purple-600 border border-purple-100',
    whatsapp: 'bg-green-50 text-green-600 border border-green-100',
    visita: 'bg-amber-50 text-amber-600 border border-amber-100',
    nota: 'bg-slate-100 text-slate-600 border border-slate-200'
  }
  return estilos[tipo] || estilos.nota
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(3px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>